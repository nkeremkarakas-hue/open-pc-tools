# Open PC Tools

Windows, Linux ve macOS için açık kaynaklı oyun ve PC yazılımı başlatıcısı.

> v0.3.0 — profesyonel dashboard, yerel güvenlik durumu, bildirimler, güvenli başlatma ve Türkçe/İngilizce dil seçimi.

## Özellikler

- Windows'ta Steam, Epic Games Launcher, Discord ve VS Code algılama
- Steam kütüphanelerindeki **yasal olarak kurulmuş oyunları** otomatik listeleme ve `steam://rungameid` ile başlatma
- Linux'ta `.desktop` uygulamalarını ve Steam oyunlarını tarama
- macOS'ta `/Applications` ve kullanıcı uygulamalarını tarama
- Arama, kategori filtreleri ve yenileme
- Bulunan uygulamaları tek tıkla başlatma
- Kullanıcı tanımlı özel yazılım ekleme
- Cihazdaki Windows Defender veya Linux ClamAV ile kullanıcının seçtiği klasörü tarama
- Türkçe / İngilizce arayüz seçimi
- `src/locales/*.json` üzerinden genişletilebilir localization yapısı
- Dashboard istatistikleri, toast bildirimleri ve responsive görünüm
- Linux'ta shell kullanmadan güvenli uygulama başlatma
- Steam hesap etiketlerini ve kullanıcı adlarını yönetme; parolaları OS güvenli kasasında şifreli saklama
- Electron güvenlik modeli: `contextIsolation` açık, renderer'da Node erişimi kapalı
- Windows, Linux ve macOS için paketleme yapılandırması

## Güvenlik ve yasal kapsam

Open PC Tools korsan, kırılmış veya lisanssız oyun indirme/dağıtma özelliği içermez. Oyunlar yalnızca kullanıcının cihazında yasal olarak kurulu olduklarında algılanır. Güvenlik taraması mevcut işletim sistemi tarayıcısını çağırır; uygulama kendi antivirüs motoru olduğunu iddia etmez.

- Windows: Windows Defender (`Start-MpScan`)
- Linux: ClamAV (`clamscan`); yoksa `sudo apt install clamav`
- macOS: yerel üçüncü taraf tarayıcı entegrasyonu henüz eklenmedi

## Kurulum

Node.js 20+ ve npm gereklidir.

```bash
npm install
npm start
```

## Paketleme

```bash
npm run dist
```

`dist/` altında işletim sistemine uygun paketler oluşturulur. Paketleme işlemi hedef işletim sisteminde veya CI/CD üzerinde çalıştırılmalıdır.

## Geliştirme

```bash
npm run dev
```

Kullanıcı verileri Electron'un uygulama veri klasöründe `apps.json` olarak saklanır.

## Test

```bash
npm test
```

Antivirüs entegrasyonunun açıklaması, UI kütüphanesi seçenekleri ve localization mimarisi için [`docs/UI-AND-LOCALIZATION.md`](docs/UI-AND-LOCALIZATION.md) dosyasına bakın.

Steam hesap kasasının güvenlik modeli için [`docs/STEAM-VAULT.md`](docs/STEAM-VAULT.md) dosyasına bakın.

## Yol haritası

- [ ] Epic, GOG, Ubisoft ve Xbox oyun kütüphaneleri
- [ ] Save yedekleme/geri yükleme
- [ ] Mod ve başlatma parametresi profilleri
- [ ] Eklenti API'si
- [ ] Otomatik güncelleme ve imzalı dağıtım paketleri
- [ ] macOS güvenlik tarayıcısı entegrasyonu

## Katkı

Issue ve pull request'ler memnuniyetle karşılanır. Kod değişikliklerinden önce bir issue açarak yaklaşımı tartışabilirsiniz.

## Lisans

MIT — ayrıntılar için [LICENSE](LICENSE) dosyasına bakın.
