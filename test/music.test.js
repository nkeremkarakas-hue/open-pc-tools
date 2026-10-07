const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createMusicStore } = require('../src/music');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'open-pc-music-')); const track = path.join(dir, 'theme.mp3'); fs.writeFileSync(track, 'fixture');
const store = createMusicStore(path.join(dir, 'music.json')); const list = store.add([track, path.join(dir, 'malware.exe')]);
assert.strictEqual(list.length, 1); assert.match(list[0].url, /^file:/); assert.strictEqual(store.remove(list[0].id).length, 0);
console.log('music tests passed');
