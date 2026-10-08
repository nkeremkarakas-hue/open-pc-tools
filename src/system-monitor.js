const fs = require('fs');
const os = require('os');
function readTemperatures() {
  if (process.platform !== 'linux') return [];
  try { return fs.readdirSync('/sys/class/thermal').filter(x => x.startsWith('thermal_zone')).map(zone => { const raw = Number(fs.readFileSync(`/sys/class/thermal/${zone}/temp`, 'utf8')); return { sensor: zone, celsius: Math.round(raw / 10) / 100 }; }).filter(item => Number.isFinite(item.celsius)); } catch { return []; }
}
function snapshot() {
  const totalGb = Math.round(os.totalmem() / 107374182.4) / 10;
  const freeGb = Math.round(os.freemem() / 107374182.4) / 10;
  return { platform: process.platform, arch: process.arch, cpuModel: os.cpus()[0]?.model || 'Bilinmiyor', cpuCores: os.cpus().length, memory: { totalGb, freeGb, usedPercent: Math.round((1 - os.freemem() / os.totalmem()) * 100) }, uptimeHours: Math.round(os.uptime() / 360) / 10, load: os.loadavg(), temperatures: readTemperatures(), wear: { memory: 'unavailable', chipQuality: 'not-measurable', note: 'Bellek yıpranması ve çip kalite puanı genel işletim sistemi API’leriyle güvenilir biçimde ölçülemez.' } };
}
module.exports = { snapshot, readTemperatures };
