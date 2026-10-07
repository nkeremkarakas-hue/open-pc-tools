const assert = require('assert');
const { normalizeIban, validateDonationConfig, validateSteamConfig } = require('../src/validation');
assert.strictEqual(normalizeIban('tr00 0000-0000'), 'TR0000000000');
assert.strictEqual(validateDonationConfig({ iban: 'TR33 0000 0000 0000 0000 0000 01' }).configured, true);
assert.strictEqual(validateDonationConfig({ iban: 'IBAN_PLACEHOLDER_TO_BE_CONFIGURED' }).configured, false);
assert.strictEqual(validateSteamConfig({ key: 'A'.repeat(32), steamId: '76561198000000000' }), true);
assert.strictEqual(validateSteamConfig({ key: 'bad', steamId: 'not-id' }), false);
console.log('validation tests passed');
