const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { atomicWrite, readJson } = require('./store');
const supported = new Set(['.mp3', '.ogg', '.wav', '.m4a', '.flac', '.webm']);
function createMusicStore(file) {
  function read() { return readJson(file, []).filter(item => item && item.path && supported.has(path.extname(item.path).toLowerCase())); }
  function add(paths) {
    const current = read(); const seen = new Set(current.map(item => item.path));
    const additions = paths.filter(item => typeof item === 'string' && supported.has(path.extname(item).toLowerCase()) && fs.existsSync(item) && !seen.has(item)).map(item => ({ id: `track-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, path: item, name: path.basename(item) }));
    atomicWrite(file, [...current, ...additions], 0o600); return [...current, ...additions].map(item => ({ ...item, url: pathToFileURL(item.path).href }));
  }
  function remove(id) { const next = read().filter(item => item.id !== id); atomicWrite(file, next, 0o600); return next.map(item => ({ ...item, url: pathToFileURL(item.path).href })); }
  function list() { return read().map(item => ({ ...item, url: pathToFileURL(item.path).href })); }
  return { list, add, remove };
}
module.exports = { createMusicStore, supported };
