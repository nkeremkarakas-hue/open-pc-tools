# Bağış Paneli

Bağış paneli Türkiye kullanımına uygun olarak yalnızca **IBAN banka havalesi** yöntemini görünür kılar. Stripe, PayPal ve Ko-fi seçenekleri kaldırılmadı; yapılandırmada devre dışı ve UI’da gizli tutuluyor.

Public depoya gerçek IBAN eklenmedi. `src/config/donation.json` dosyası güvenli bir placeholder içerir:

```json
{
  "method": "iban",
  "recipientName": "Alıcı adı daha sonra eklenecek",
  "iban": "IBAN_PLACEHOLDER_TO_BE_CONFIGURED"
}
```

Gerçek IBAN eklenmeden önce alıcı adının ve IBAN’ın public olarak paylaşılmasına ayrıca onay verilmelidir. Vergi veya ödeme işlem ücreti eklenmez.
