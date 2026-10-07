const assert = require('assert');
const fs = require('fs');
const main = fs.readFileSync(require.resolve('../src/main.js'), 'utf8');
assert.match(main, /safeStorage\.isEncryptionAvailable/);
assert.match(main, /safeStorage\.encryptString/);
assert.match(main, /atomicWrite\(vaultFile, accounts, 0o600\)/);
assert.doesNotMatch(main, /steam:\/\/login/);
console.log('vault security contract passed');
