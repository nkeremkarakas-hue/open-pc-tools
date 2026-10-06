# Steam Hesap Kasası

## Güvenlik modeli

- Şifreler düz metin olarak yazılmaz.
- Electron `safeStorage` kullanılır.
- Windows'ta Windows DPAPI, macOS'ta Keychain, Linux'ta Secret Service/libsecret kullanılır.
- Kasa dosyası `steam-vault.json` olarak uygulamanın kullanıcı veri klasöründe tutulur ve dosya izinleri `0600` yapılır.
- UI yalnızca hesap etiketi ve kullanıcı adını görür; şifre hiçbir zaman listelenmez.
- Güvenli işletim sistemi deposu kullanılamıyorsa uygulama şifreyi kaydetmez.

## Hesap geçişi

Uygulama Steam kullanıcı adını gösterir ve Steam istemcisini açar. Şifreyi Steam’e otomatik olarak enjekte etmez; bu tasarım, parolanın command line, URI veya clipboard üzerinden sızmasını önler. Gerçek oturum geçişi Steam’in kendi oturum ekranında tamamlanır.

## Sınırlar

İşletim sistemi anahtar deposu sıfırlanırsa şifreli veriler çözülemeyebilir. Bu nedenle kasa bir parola yöneticisinin yerini tutmaz; kullanıcının Steam hesabında Steam Guard ve kurtarma e-postası açık olmalıdır. Open PC Tools parolayı kurtaramaz ve kullanıcıdan parola dışa aktarmasını istemez.
