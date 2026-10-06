const assert = require('assert');
const path = require('path');
const { securityScan } = require('../src/security');

(async () => {
  const missing = await securityScan(path.join(__dirname, 'does-not-exist'), process.platform);
  assert.equal(missing.status, 'not-found');

  const current = await securityScan(__dirname, 'darwin');
  assert.equal(current.status, 'unavailable');
  assert.match(current.message, /macOS/i);

  console.log('security tests passed');
})().catch(error => { console.error(error); process.exit(1); });
