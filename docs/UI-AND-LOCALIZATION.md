# UI, Localization ve Güvenlik Mimarisinin Notları

## JSON tabanlı localization

Çeviriler `src/locales/tr.json` ve `src/locales/en.json` dosyalarında tutulur. Renderer, çeviriyi Electron IPC üzerinden ister; ana süreç yalnızca `src/locales` altındaki beyaz listeye alınmış dilleri okur. Böylece renderer'a Node.js dosya erişimi açılmaz.

Yeni dil eklemek için aynı anahtarları içeren yeni bir JSON dosyası ekleyin ve `src/main.js` içindeki `supportedLocales` listesine dil kodunu ekleyin.

## UI kütüphanesi seçenekleri

- **Tailwind CSS:** Mevcut özel CSS yerine hızlı ve tutarlı tasarım token'ları için uygun. Electron'da derleme adımı ekler.
- **React + Radix UI / shadcn/ui:** Modal, dropdown, tooltip ve erişilebilirlik ihtiyaçları büyürse en güçlü seçenek. Bundle boyutu ve mimari karmaşıklık artar.
- **Lit:** React gibi tam uygulama framework'ü istemeyen, web component tabanlı hafif seçenek.
- **Fluent UI:** Windows görünümü ve erişilebilir bileşenler öncelikliyse değerlendirilebilir.
- **MUI:** Hazır bileşen kapsamı geniştir; ancak mevcut marka tasarımını özelleştirmek daha fazla tema ayarı gerektirir.

Bu sürümde bağımlılık yükünü düşük tutmak için vanilla JS + özel CSS korunmuştur. UI büyüdüğünde önerilen geçiş yolu `React + Tailwind + Radix UI` olur.

## Antivirüs entegrasyonu

`src/security.js`, işletim sistemine göre yerel motoru çağırır:

- Windows: `powershell.exe` ile `Start-MpScan -ScanType CustomScan`
- Linux: `clamscan -r --infected --no-summary`
- macOS: güvenli şekilde `unavailable` döner; henüz entegrasyon yok

Kullanıcı yolu shell string'i olarak birleştirilmez; `execFile` argüman dizisi kullanılır. Uygulama kendi antivirüs motoru olduğunu iddia etmez ve yalnızca kullanıcının seçtiği yolu tarar. `test/security.test.js` en azından eksik yol, desteklenmeyen platform ve sonuç durumlarını otomatik kontrol eder.
