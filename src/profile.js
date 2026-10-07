const fs = require('fs');
const path = require('path');
const { atomicWrite, readJson } = require('./store');
function createProfileStore(file) {
  const defaults = { displayName: 'Open PC kullanıcısı', avatar: '⌘', language: 'tr', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  function read() { return { ...defaults, ...readJson(file, {}) }; }
  function save(input = {}) {
    const current = read();
    const next = { ...current, displayName: String(input.displayName || current.displayName).trim().slice(0, 60) || defaults.displayName, avatar: String(input.avatar || current.avatar).slice(0, 2), language: ['tr', 'en'].includes(input.language) ? input.language : current.language, updatedAt: new Date().toISOString() };
    atomicWrite(file, next, 0o600);
    return next;
  }
  return { read, save };
}
module.exports = { createProfileStore };
