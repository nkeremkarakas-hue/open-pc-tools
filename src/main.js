const { app, BrowserWindow, ipcMain, shell, safeStorage } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFile } = require('child_process');
const { securityScan } = require('./security');
const { normalizeGame, summarizeGames } = require('./steam-stats');
const { createProfileStore } = require('./profile');
const { autoUpdater } = require('electron-updater');

const isWin = process.platform === 'win32';
const isLinux = process.platform === 'linux';
const isMac = process.platform === 'darwin';
const dataFile = path.join(app.getPath('userData'), 'apps.json');
const vaultFile = path.join(app.getPath('userData'), 'steam-vault.json');
const steamApiFile = path.join(app.getPath('userData'), 'steam-api.json');
const profileFile = path.join(app.getPath('userData'), 'profile.json');
const donationFile = path.join(__dirname, 'config', 'donation.json');
const localDonationFile = path.join(app.getPath('userData'), 'donation.local.json');
const profileStore = createProfileStore(profileFile);
let updateState = { status: 'idle', version: app.getVersion(), message: '' };
const supportedLocales = new Set(['tr', 'en']);
const providers = [
  { id: 'steam', name: 'Steam', category: 'Store', loginUrl: 'https://store.steampowered.com/login/', launcher: 'steam://open/main' },
  { id: 'xbox', name: 'Xbox / Microsoft', category: 'Store', loginUrl: 'https://account.microsoft.com/', launcher: 'ms-xbl-3d8b9300://home/' },
  { id: 'epic', name: 'Epic Games', category: 'Store', loginUrl: 'https://www.epicgames.com/id/login', launcher: 'com.epicgames.launcher://apps' },
  { id: 'gog', name: 'GOG', category: 'Store', loginUrl: 'https://auth.gog.com/login', launcher: 'goggalaxy://open' },
  { id: 'ubisoft', name: 'Ubisoft Connect', category: 'Store', loginUrl: 'https://account.ubisoft.com/', launcher: 'uplay://open' },
  { id: 'ea', name: 'EA app', category: 'Store', loginUrl: 'https://myaccount.ea.com/', launcher: 'origin2://launch' },
  { id: 'battle-net', name: 'Battle.net', category: 'Store', loginUrl: 'https://account.blizzard.com/login', launcher: 'battlenet://' },
  { id: 'itch', name: 'itch.io', category: 'Store', loginUrl: 'https://itch.io/login', launcher: 'itchio://' },
  { id: 'heroic', name: 'Heroic Games Launcher', category: 'Launcher', loginUrl: 'https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher', launcher: 'heroic://' },
  { id: 'lutris', name: 'Lutris', category: 'Launcher', loginUrl: 'https://lutris.net/', launcher: 'lutris://' }
];

function createWindow() {
  const win = new BrowserWindow({ width: 1280, height: 820, minWidth: 980, minHeight: 640, backgroundColor: '#0b0f17', webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false } });
  win.loadFile(path.join(__dirname, 'index.html'));
}
function readCustomApps() { try { return JSON.parse(fs.readFileSync(dataFile, 'utf8')); } catch { return []; } }
function writeCustomApps(apps) { fs.mkdirSync(path.dirname(dataFile), { recursive: true }); fs.writeFileSync(dataFile, JSON.stringify(apps, null, 2)); }
function readVault() { try { return JSON.parse(fs.readFileSync(vaultFile, 'utf8')); } catch { return []; } }
function writeVault(accounts) { fs.mkdirSync(path.dirname(vaultFile), { recursive: true }); fs.writeFileSync(vaultFile, JSON.stringify(accounts, null, 2), { mode: 0o600 }); try { fs.chmodSync(vaultFile, 0o600); } catch {} }
function readSteamApi() { try { const value = JSON.parse(fs.readFileSync(steamApiFile, 'utf8')); return { key: safeStorage.decryptString(Buffer.from(value.key, 'base64')), steamId: value.steamId }; } catch { return null; } }
function writeSteamApi(config) { fs.mkdirSync(path.dirname(steamApiFile), { recursive: true }); fs.writeFileSync(steamApiFile, JSON.stringify({ key: safeStorage.encryptString(config.key).toString('base64'), steamId: config.steamId, updatedAt: new Date().toISOString() }, null, 2), { mode: 0o600 }); try { fs.chmodSync(steamApiFile, 0o600); } catch {} }
function exists(p) { try { return fs.existsSync(p); } catch { return false; } }
function appItem(name, source, executable, category, note = '', extra = {}) { return { id: `${source}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name, source, executable, category, note, available: exists(executable), ...extra }; }
function parseSteamGames(libraryRoot) {
  const steamApps = path.join(libraryRoot, 'steamapps');
  if (!exists(steamApps)) return [];
  return fs.readdirSync(steamApps).filter(f => /^appmanifest_\d+\.acf$/.test(f)).map(file => {
    try {
      const text = fs.readFileSync(path.join(steamApps, file), 'utf8');
      const appid = (text.match(/"appid"\s+"(\d+)"/) || [])[1];
      const name = (text.match(/"name"\s+"([^\n"]+)"/) || [])[1];
      if (!appid || !name) return null;
      return { id: `steam-game-${appid}`, name, source: 'Steam', executable: `steam://rungameid/${appid}`, category: 'Oyun', note: 'Kurulu oyun', available: true, protocol: true };
    } catch { return null; }
  }).filter(Boolean);
}
function steamLibraries() {
  const candidates = isWin ? [path.join(process.env.ProgramFiles || '', 'Steam'), path.join(process.env['ProgramFiles(x86)'] || '', 'Steam'), path.join(process.env.LOCALAPPDATA || '', 'Steam')] : [path.join(os.homedir(), '.steam/steam'), path.join(os.homedir(), '.local/share/Steam'), path.join(os.homedir(), '.steam/debian-installation')];
  const roots = new Set(candidates.filter(exists));
  [...roots].forEach(root => {
    const vdf = path.join(root, 'steamapps', 'libraryfolders.vdf');
    if (exists(vdf)) { const text = fs.readFileSync(vdf, 'utf8'); [...text.matchAll(/"path"\s+"([^"]+)"/g)].forEach(m => roots.add(m[1].replace(/\\\\/g, '\\'))); }
  });
  return [...roots];
}
function detectApps() {
  const list = [];
  steamLibraries().forEach(root => list.push(...parseSteamGames(root)));
  if (isWin) {
    const candidates = [
      ['Steam', 'Steam', path.join(process.env.ProgramFiles || '', 'Steam', 'steam.exe'), 'Oyun'],
      ['Epic Games Launcher', 'Epic', path.join(process.env.ProgramFiles || '', 'Epic Games', 'Launcher', 'Portal', 'Binaries', 'Win64', 'EpicGamesLauncher.exe'), 'Oyun'],
      ['Discord', 'System', path.join(process.env.LOCALAPPDATA || '', 'Discord', 'Update.exe'), 'İletişim'],
      ['Visual Studio Code', 'Dev', path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Microsoft VS Code', 'Code.exe'), 'Geliştirme']
    ];
    candidates.forEach(x => { if (exists(x[2])) list.push(appItem(...x)); });
  } else if (isLinux) {
    const desktopDirs = ['/usr/share/applications', path.join(os.homedir(), '.local/share/applications')]; const seen = new Set();
    desktopDirs.forEach(dir => { if (!exists(dir)) return; fs.readdirSync(dir).filter(f => f.endsWith('.desktop')).slice(0, 300).forEach(file => { const full = path.join(dir, file); if (seen.has(file)) return; const text = fs.readFileSync(full, 'utf8'); const name = (text.match(/^Name=(.*)$/m) || [])[1]; const exec = (text.match(/^Exec=([^\n ]+)/m) || [])[1]; if (name && exec && !/^(Settings|Help|Documentation|Uninstall|Install)/i.test(name)) { seen.add(file); list.push(appItem(name, 'Linux', exec, /steam|heroic|lutris|game/i.test(name) ? 'Oyun' : 'Uygulama', file)); } }); });
  } else if (isMac) {
    ['/Applications', path.join(os.homedir(), 'Applications')].forEach(dir => { if (!exists(dir)) return; fs.readdirSync(dir).filter(f => f.endsWith('.app')).forEach(f => list.push(appItem(f.replace(/\.app$/, ''), 'macOS', path.join(dir, f), 'Uygulama'))); });
  }
  return [...new Map([...list, ...readCustomApps()].map(item => [item.id, item])).values()];
}
function launchExecutable(executable, protocol = false) {
  if (!executable) return false;
  if (protocol || executable.startsWith('steam://')) { shell.openExternal(executable); return true; }
  if (isWin) { execFile(executable, [], { detached: true, windowsHide: true }); return true; }
  if (isMac) { shell.openPath(executable); return true; }
  execFile(executable, [], { detached: true, windowsHide: true });
  return true;
}
ipcMain.handle('apps:list', () => detectApps());
ipcMain.handle('apps:add', (_, item) => { const apps = readCustomApps(); const newItem = { ...item, id: `custom-${Date.now()}`, source: 'Özel', available: exists(item.executable) }; apps.push(newItem); writeCustomApps(apps); return newItem; });
ipcMain.handle('apps:remove', (_, id) => { writeCustomApps(readCustomApps().filter(x => x.id !== id)); return true; });
ipcMain.handle('apps:launch', (_, executable, protocol = false) => launchExecutable(executable, protocol));
ipcMain.handle('security:scan', (_, target) => securityScan(target));
ipcMain.handle('vault:status', () => ({ available: safeStorage.isEncryptionAvailable(), provider: process.platform === 'win32' ? 'Windows DPAPI' : process.platform === 'darwin' ? 'macOS Keychain' : 'Linux Secret Service' }));
ipcMain.handle('vault:list', () => readVault().map(({ id, label, username, updatedAt }) => ({ id, label, username, updatedAt })));
ipcMain.handle('vault:save', (_, account) => {
  if (!safeStorage.isEncryptionAvailable()) return { ok: false, message: 'İşletim sistemi güvenli depolaması kullanılamıyor.' };
  if (!account?.label || !account?.username || !account?.password) return { ok: false, message: 'Hesap adı, kullanıcı adı ve şifre zorunludur.' };
  const accounts = readVault(); const id = account.id || `steam-${Date.now()}`;
  const next = { id, label: account.label.trim(), username: account.username.trim(), password: safeStorage.encryptString(account.password), updatedAt: new Date().toISOString() };
  writeVault([...accounts.filter(item => item.id !== id), next]);
  return { ok: true, account: { id: next.id, label: next.label, username: next.username, updatedAt: next.updatedAt } };
});
ipcMain.handle('vault:delete', (_, id) => { writeVault(readVault().filter(item => item.id !== id)); return true; });
ipcMain.handle('vault:open-steam', () => { shell.openExternal('steam://open/main'); return true; });
ipcMain.handle('providers:list', () => providers.map(({ id, name, category, loginUrl }) => ({ id, name, category, loginUrl })));
ipcMain.handle('providers:login', (_, id) => { const provider = providers.find(item => item.id === id); if (!provider) return false; shell.openExternal(provider.loginUrl); return true; });
ipcMain.handle('steamapi:status', () => ({ configured: Boolean(readSteamApi()), encryptionAvailable: safeStorage.isEncryptionAvailable() }));
ipcMain.handle('steamapi:save', (_, config) => { if (!safeStorage.isEncryptionAvailable()) return { ok: false, message: 'OS güvenli kasası kullanılamıyor.' }; if (!/^[A-Za-z0-9]{20,}$/.test(config?.key || '') || !/^\d{10,20}$/.test(config?.steamId || '')) return { ok: false, message: 'Geçerli bir Steam Web API anahtarı ve SteamID64 girin.' }; writeSteamApi({ key: config.key, steamId: config.steamId }); return { ok: true }; });
ipcMain.handle('steamapi:stats', async () => {
  const config = readSteamApi(); if (!config) return { ok: false, status: 'not-configured', message: 'Önce Steam API ayarlarını kaydedin.' };
  const params = new URLSearchParams({ key: config.key, steamid: config.steamId, format: 'json', include_appinfo: '1', include_played_free_games: '1' });
  const response = await fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?${params}`);
  if (!response.ok) return { ok: false, status: 'api-error', message: `Steam API HTTP ${response.status}` };
  const data = await response.json(); const games = (data.response?.games || []).sort((a, b) => b.playtime_forever - a.playtime_forever).slice(0, 12);
  const enriched = await Promise.all(games.map(async game => { try { const r = await fetch(`https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?${new URLSearchParams({ key: config.key, steamid: config.steamId, appid: String(game.appid) })}`); const d = r.ok ? await r.json() : {}; return normalizeGame(game, d.playerstats?.achievements || []); } catch { return normalizeGame(game); } }));
  return { ok: true, games: enriched, totalGames: data.response?.game_count || summarizeGames(games).totalGames, totalHours: summarizeGames(games).totalHours };
});
ipcMain.handle('donation:config', () => { try { const base = JSON.parse(fs.readFileSync(donationFile, 'utf8')); const local = JSON.parse(fs.readFileSync(localDonationFile, 'utf8')); return { ...base, ...local, iban: local.iban || base.iban, recipientName: local.recipientName || base.recipientName, note: local.note || base.note }; } catch { return JSON.parse(fs.readFileSync(donationFile, 'utf8')); } });
ipcMain.handle('profile:get', () => profileStore.read());
ipcMain.handle('profile:save', (_, input) => profileStore.save(input));
ipcMain.handle('update:check', async () => { if (!app.isPackaged) return { ...updateState, status: 'dev-mode', message: 'Geliştirme modunda güncelleme kontrolü yapılmaz.' }; try { await autoUpdater.checkForUpdates(); return updateState; } catch (error) { updateState = { ...updateState, status: 'error', message: error.message }; return updateState; } });
ipcMain.handle('update:state', () => updateState);
ipcMain.handle('locale:load', (_, locale) => {
  const safeLocale = supportedLocales.has(locale) ? locale : 'tr';
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'locales', `${safeLocale}.json`), 'utf8'));
});
ipcMain.handle('system:info', () => ({ platform: process.platform, release: os.release(), home: os.homedir() }));
ipcMain.handle('shell:open', (_, target) => shell.openExternal(target));
app.whenReady().then(() => { createWindow(); autoUpdater.autoDownload = false; autoUpdater.on('checking-for-update', () => { updateState = { ...updateState, status: 'checking', message: '' }; }); autoUpdater.on('update-available', info => { updateState = { ...updateState, status: 'available', version: info.version, message: 'Yeni sürüm bulundu.' }; }); autoUpdater.on('update-not-available', () => { updateState = { ...updateState, status: 'current', message: 'Uygulama güncel.' }; }); autoUpdater.on('error', error => { updateState = { ...updateState, status: 'error', message: error.message }; }); app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); }); });
app.on('window-all-closed', () => { if (!isMac) app.quit(); });
