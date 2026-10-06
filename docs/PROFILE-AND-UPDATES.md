# Profil ve otomatik güncelleme

## Profil

Profil bu sürümde yerel cihaz profili olarak çalışır: görünen ad, avatar ve dil tercihi `profile.json` içinde tutulur. Dosya izinleri `0600` yapılır; hesap parolaları veya Steam API anahtarı profile yazılmaz.

## Auto-updater

Electron Builder GitHub Releases provider ile yapılandırıldı. Paketlenmiş uygulama `electron-updater` üzerinden güncelleme kontrol eder. Otomatik indirme kapalıdır; önce yeni sürüm bilgisi gösterilir, kullanıcı onayından sonra indirme/kurulum akışı eklenebilir. Geliştirme modunda yanlışlıkla GitHub kontrolü yapılmaz.

GitHub Release oluştururken Windows NSIS/portable, Linux AppImage/deb veya macOS dmg artefact'larını release'e eklemek gerekir. İmzalı artefact üretimi dağıtım öncesi zorunlu tutulmalıdır.

## Steam testleri

`test/steam-stats.test.js` fixture verisiyle saat dönüşümünü, toplam saat hesabını ve başarım oranı verisini doğrular. Gerçek API testi için kullanıcı kendi API anahtarını uygulama içinde kaydetmelidir; anahtar repoya veya test fixture'ına konmaz.
