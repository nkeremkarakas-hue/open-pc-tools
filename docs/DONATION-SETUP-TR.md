# Türkiye için bağış kurulumu

Open PC Tools v0.7.0’da yalnızca IBAN havalesi görünür. Gerçek IBAN’ı public GitHub deposuna koymamak için yerel yapılandırma kullanılır.

## Yerel dosya

`src/config/donation.local.json` dosyasını oluşturun. Bu dosya `.gitignore` içindedir ve GitHub’a gönderilmez.

```json
{
  "recipientName": "Ad Soyad veya kurum adı",
  "iban": "TR000000000000000000000000",
  "note": "Open PC Tools'u desteklemek için banka havalesi yapabilirsiniz."
}
```

Uygulama önce yerel dosyadaki değerleri, yoksa public placeholder değerlerini kullanır. Gerçek IBAN’ı uygulamaya ekledikten sonra uygulamayı yeniden başlatın.

## Alternatif ödeme kuruluşları

Stripe, PayPal ve Ko-fi bu sürümde UI’da gizli ve devre dışıdır. Türkiye’de kartla ödeme almak için iyzico, PayTR veya benzeri bir kuruluşla ayrı bir ticari hesap, kimlik doğrulama ve API sözleşmesi gerekir. Sağlayıcı hesabı ve API bilgileri olmadan entegrasyon yapılmaz; gizli anahtarlar GitHub’a yazılmaz.

Bu proje bağış tutarına vergi veya işlem ücreti eklemez. Vergi yükümlülükleri ve bağış kabul şartları için mali müşavir veya yetkili kurumla görüşün.
