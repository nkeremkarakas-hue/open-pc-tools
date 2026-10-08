const { atomicWrite, readJson } = require('./store');
function createGameRecords(file) {
  function list() { return readJson(file, []).sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt)); }
  function record(input = {}) {
    const entry = { id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, appid: Number(input.appid) || null, name: String(input.name || 'Bilinmeyen oyun').slice(0, 160), startedAt: new Date().toISOString(), source: String(input.source || 'Steam').slice(0, 40) };
    const next = [entry, ...list()].slice(0, 500); atomicWrite(file, next, 0o600); return entry;
  }
  function clear() { atomicWrite(file, [], 0o600); return []; }
  return { list, record, clear };
}
module.exports = { createGameRecords };
