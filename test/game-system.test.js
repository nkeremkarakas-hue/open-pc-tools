const assert = require('assert');
const fs = require('fs'); const os = require('os'); const path = require('path');
const { createGameRecords } = require('../src/game-records');
const { snapshot } = require('../src/system-monitor');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'open-pc-records-')); const records = createGameRecords(path.join(dir, 'records.json'));
const item = records.record({ appid: 730, name: 'Test Game' }); assert.strictEqual(records.list()[0].appid, 730); assert.strictEqual(records.list()[0].id, item.id);
const info = snapshot(); assert.ok(info.memory.totalGb > 0); assert.strictEqual(info.wear.chipQuality, 'not-measurable');
console.log('game records and system tests passed');
