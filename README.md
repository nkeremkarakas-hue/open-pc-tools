# Open PC Tools

Windows, Linux ve macOS için açık kaynaklı oyun ve PC yazılımı başlatıcısı.

> İlk sürüm: v0.1.0 — uygulama tarama, arama, kategori filtreleme, başlatma ve özel yazılım ekleme.

## Özellikler

- Windows'ta Steam, Epic Games Launcher, Discord ve VS Code algılama
- Linux'ta `.desktop` uygulamalarını tarama
- macOS'ta `/Applications` ve kullanıcı uygulamalarını tarama
- Arama ve kategori filtreleri
- Bulunan uygulamaları tek tıkla başlatma
- Kullanıcı tanımlı özel yazılım ekleme
- Electron güvenlik modeli: `contextIsolation` açık, renderer'da Node erişimi kapalı
- Windows, Linux ve macOS için paketleme yapılandırması

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

Yeni mağaza entegrasyonları ve araçlar için `src/main.js` içindeki tarama katmanı genişletilebilir. Kullanıcı verileri Electron'un uygulama veri klasöründe `apps.json` olarak saklanır.

## Yol haritası

- [ ] Steam kütüphanesi ve oyun kurulumlarını derinlemesine algılama
- [ ] Epic, GOG, Ubisoft ve Xbox entegrasyonları
- [ ] Save yedekleme/geri yükleme
- [ ] Mod ve başlatma parametresi profilleri
- [ ] Eklenti API'si
- [ ] Otomatik güncelleme ve imzalı dağıtım paketleri
- [ ] Türkçe/İngilizce dil dosyaları

## Katkı

Issue ve pull request'ler memnuniyetle karşılanır. Kod değişikliklerinden önce bir issue açarak yaklaşımı tartışabilirsiniz.

## Lisans

MIT — ayrıntılar için [LICENSE](LICENSE) dosyasına bakın.
