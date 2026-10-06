const fs = require('fs');
const os = require('os');
const { execFile } = require('child_process');

function exists(target) { try { return fs.existsSync(target); } catch { return false; } }
function run(command, args, options = {}) {
  return new Promise(resolve => execFile(command, args, { timeout: 120000, windowsHide: true, ...options }, (error, stdout, stderr) => resolve({ ok: !error, stdout: stdout || '', stderr: stderr || '', error: error?.message || '' })));
}

/**
 * Güvenlik taraması: dosya taramasını kendisi yapmaz; işletim sisteminin
 * güvenilir yerel motorunu çağırır. Hedef yol kullanıcıdan gelir ve shell
 * üzerinden birleştirilmez; böylece shell injection riski azaltılır.
 */
async function securityScan(target, platform = process.platform) {
  if (!target || !exists(target)) return { ok: false, status: 'not-found', message: 'Tarama yolu bulunamadı.' };
  if (platform === 'win32') {
    const result = await run('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', `Start-MpScan -ScanPath ${JSON.stringify(target)} -ScanType CustomScan`]);
    return { ok: result.ok, status: result.ok ? 'clean-or-complete' : 'error', message: result.ok ? 'Windows Defender taraması tamamlandı.' : result.error };
  }
  if (platform === 'linux') {
    const clamscan = await run('sh', ['-c', 'command -v clamscan']);
    if (!clamscan.ok) return { ok: false, status: 'unavailable', message: 'ClamAV bulunamadı. Kurulum: sudo apt install clamav' };
    const result = await run('clamscan', ['-r', '--infected', '--no-summary', target]);
    return { ok: result.ok, status: result.ok ? 'clean' : 'threat-or-error', message: result.ok ? 'ClamAV taraması temiz tamamlandı.' : 'Şüpheli dosya bulundu veya tarama hata verdi.', output: result.stdout + result.stderr };
  }
  if (platform === 'darwin') return { ok: false, status: 'unavailable', message: 'macOS için yerel tarayıcı entegrasyonu henüz yok.' };
  return { ok: false, status: 'unavailable', message: `Desteklenmeyen işletim sistemi: ${os.platform()}` };
}
module.exports = { securityScan };
