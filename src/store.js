const fs = require('fs');
const path = require('path');

function atomicWrite(file, value, mode = 0o600) {
  const directory = path.dirname(file);
  fs.mkdirSync(directory, { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  const backup = `${file}.bak`;
  const content = JSON.stringify(value, null, 2);
  fs.writeFileSync(temporary, content, { mode });
  try { fs.chmodSync(temporary, mode); } catch {}
  if (fs.existsSync(file)) { try { fs.copyFileSync(file, backup); fs.chmodSync(backup, mode); } catch {} }
  fs.renameSync(temporary, file);
  try { fs.chmodSync(file, mode); } catch {}
}
function readJson(file, fallback) {
  for (const candidate of [file, `${file}.bak`]) {
    try { return JSON.parse(fs.readFileSync(candidate, 'utf8')); } catch {}
  }
  return fallback;
}
module.exports = { atomicWrite, readJson };
