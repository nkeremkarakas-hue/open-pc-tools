const fs = require('fs');
const path = require('path');
function createProfileStore(file) {
  const defaults = { displayName: 'Open PC kullanıcısı', avatar: '⌘', language: 'tr', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  function read() { try { return { ...defaults, ...JSON.parse(fs.readFileSync(file, 'utf8')) }; } catch { return defaults; } }
  function save(input = {}) {
    const current = read();
    const next = { ...current, displayName: String(input.displayName || current.displayName).trim().slice(0, 60) || defaults.displayName, avatar: String(input.avatar || current.avatar).slice(0, 2), language: ['tr', 'en'].includes(input.language) ? input.language : current.language, updatedAt: new Date().toISOString() };
    fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(next, null, 2), { mode: 0o600 }); try { fs.chmodSync(file, 0o600); } catch {}
    return next;
  }
  return { read, save };
}
module.exports = { createProfileStore };
