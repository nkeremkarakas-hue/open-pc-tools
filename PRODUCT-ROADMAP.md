# Open PC Tools — Ürün Yol Haritası

## Ürün hedefi

Open PC Tools; Windows, Linux ve macOS üzerinde çalışan, kullanıcının oyunlarını ve PC araçlarını tek merkezden yönettiği, hesap güvenliğini koruyan ve açık kaynak olarak geliştirilen bir masaüstü platformudur.

Bu ürün yalnızca bir launcher olmayacak. Hedef; yerel-first veri modeli, sağlayıcıların resmî bağlantı akışları, performanslı kütüphane, oyun istatistikleri, güvenli kasa ve şeffaf güncelleme mekanizmasını tek bir üründe birleştirmektir.

## Sürüm planı

### Faz 1 — Temel kalite ve güvenilirlik

- Modüler ana süreç ve servis sınırları
- Atomic dosya yazımı ve veri kurtarma
- Merkezi hata yönetimi ve tanılama ekranı
- Kütüphane tarama önbelleği
- Ayarlar ve gizlilik ekranı
- UI bileşenlerinin erişilebilirlik kontrolü
- Linux, Windows ve macOS smoke test matrisi

### Faz 2 — Ürün deneyimi

- Komut paleti (`Ctrl/Cmd + K`)
- Favoriler, son kullanılanlar ve başlatma geçmişi
- Gelişmiş arama ve etiketler
- Oyun kartlarında saat, başarım ve son oynama bilgisi
- Tema, yoğunluk ve dil ayarları
- Klavye ile tam gezinme
- Boş, yükleniyor, hata ve çevrimdışı durum tasarımları

### Faz 3 — Sağlayıcı adaptörleri

- Steam Web API ve yerel Steam kütüphanesi
- Microsoft/Xbox için resmî Device Code veya OAuth akışı
- Epic, GOG, Ubisoft, EA ve Battle.net için yalnızca onaylı resmî akışlar
- Tokenların OS güvenli kasasında saklanması
- Her sağlayıcı için bağımsız adapter ve capability modeli
- Bağlantı iptali ve token silme

Şifreleri otomatik olarak başka servislere aktaran veya servis kurallarını aşan entegrasyon yapılmayacaktır.

### Faz 4 — Güvenlik ve dağıtım

- İmzalı Windows, Linux ve macOS paketleri
- GitHub Releases auto-updater için imza doğrulaması
- CSP ve güvenli external-link allowlist
- IPC input validation ve rate limit
- Güvenli crash raporu: varsayılan kapalı, kişisel veri içermeyen opt-in model
- Sürüm geri alma ve bozuk güncelleme kurtarma

### Faz 5 — Açık kaynak topluluğu

- Katkı rehberi ve kod sahipleri
- CI üzerinde lint, test, build ve güvenlik taraması
- Issue ve feature request şablonları
- Release checklist
- Türkçe ve İngilizce kullanıcı dokümantasyonu
- Plugin API için tehdit modeli ve izin modeli

## Teknik ilkeler

1. **Local-first:** Kullanıcının kütüphanesi ve ayarları bağlantı olmadan çalışır.
2. **No plaintext secrets:** Parola, API anahtarı ve token düz metin saklanmaz.
3. **Official flows only:** Sağlayıcı entegrasyonları resmî OAuth/Device Code/API akışlarını kullanır.
4. **Fail safely:** Ağ, updater veya antivirüs hatası uygulamayı çökertmez.
5. **Observable:** Kullanıcı neyin tarandığını, neyin kaydedildiğini ve neyin gönderildiğini anlayabilir.
6. **Testable:** İş mantığı Electron UI’dan ayrılır ve fixture testleriyle doğrulanır.
7. **Cross-platform:** Platform özel kodlar adapter içinde tutulur.
8. **Reversible:** Hesap bağlantısı, token ve yerel veri kullanıcı tarafından silinebilir.

## İlk büyük teknik kilometre taşı: v0.9 — başlatıldı

v0.9, v1.0 öncesi ürün kalitesi sürümüdür. Bu sürümün ilk çekirdek temeli tamamlandı:

- Atomic JSON store ve `.bak` kurtarma kopyaları
- Merkezi doğrulama ve ağ zaman aşımı koruması
- Shell’siz ClamAV motoru tespiti
- Genişletilmiş davranış testleri
- Güvenli oyun performans profilleri ve Türkçe yama kaynak araması

Sonraki v0.9 iterasyon hedefleri:

- Ayarlar paneli
- Tanılama/health ekranı
- Kütüphane tarama önbelleği
- Komut paleti
- Favori uygulamalar
- Başlatma geçmişi
- Daha iyi hata durumları
- CI doğrulama betiği

## v1.0 kabul kriterleri

- Temiz bir makinede tek komutla kurulabilme
- Windows, Linux ve macOS için paket üretilebilme
- En az Steam akışının gerçek cihazda doğrulanması
- Gizli bilgilerin Git geçmişinde bulunmaması
- Güncelleme paketlerinin imza kontrolünden geçmesi
- Kritik iş mantığının test kapsamının bulunması
- Kullanıcı kılavuzu ve güvenlik modeliyle birlikte yayınlanması
