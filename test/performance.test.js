const assert = require('assert');
const { getPerformanceProfiles, recommendPerformance } = require('../src/performance');
assert.strictEqual(getPerformanceProfiles().length, 3);
assert.strictEqual(recommendPerformance({ platform: 'win32', memoryGb: 4 }).profile, 'competitive');
assert.strictEqual(recommendPerformance({ platform: 'linux', memoryGb: 16 }).profile, 'balanced');
console.log('performance tests passed');
