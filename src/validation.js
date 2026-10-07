function normalizeIban(value = '') {
  return String(value).replace(/[\s-]/g, '').toUpperCase();
}
function isPlaceholder(value = '') {
  return !value || /PLACEHOLDER|^TR0+$/.test(String(value).toUpperCase());
}
function validateDonationConfig(input = {}) {
  const iban = normalizeIban(input.iban);
  return {
    enabled: input.enabled !== false,
    method: 'iban',
    recipientName: String(input.recipientName || '').trim().slice(0, 120),
    iban,
    note: String(input.note || '').trim().slice(0, 300),
    configured: /^TR\d{24}$/.test(iban) && !isPlaceholder(iban),
    otherMethods: { stripe: { enabled: false }, paypal: { enabled: false }, koFi: { enabled: false } }
  };
}
function validateSteamConfig(input = {}) {
  const key = String(input.key || '').trim();
  const steamId = String(input.steamId || '').trim();
  return /^[A-Za-z0-9]{20,}$/.test(key) && /^\d{10,20}$/.test(steamId);
}
module.exports = { normalizeIban, isPlaceholder, validateDonationConfig, validateSteamConfig };
