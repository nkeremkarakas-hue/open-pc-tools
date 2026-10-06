const { app, BrowserWindow, ipcMain, shell, safeStorage } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFile } = require('child_process');
const { securityScan } = require('./security');

const isWin = process.platform === 'win32';
const isLinux = process.platform === 'linux';
const isMac = process.platform === 'darwin';
const dataFile = path.join(app.getPath('userData'), 'apps.json');
const vaultFile = path.join(app.getPath('userData'), 'steam-vault.json');
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
ipcMain.handle('locale:load', (_, locale) => {
  const safeLocale = supportedLocales.has(locale) ? locale : 'tr';
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'locales', `${safeLocale}.json`), 'utf8'));
});
ipcMain.handle('system:info', () => ({ platform: process.platform, release: os.release(), home: os.homedir() }));
ipcMain.handle('shell:open', (_, target) => shell.openExternal(target));
app.whenReady().then(() => { createWindow(); app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); }); });
app.on('window-all-closed', () => { if (!isMac) app.quit(); });
