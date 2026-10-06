# Steam Web API İstatistikleri

Uygulama, kullanıcının sağladığı **Steam Web API anahtarı** ve **SteamID64** ile `IPlayerService/GetOwnedGames` çağrısı yapar. En çok oynanan 12 oyun için `ISteamUserStats/GetPlayerAchievements` çağrısı yapılarak oynama saati ve kazanılan/toplam başarım sayısı gösterilir.

## Güvenlik

- API anahtarı renderer'a geri döndürülmez.
- Ana süreçte Electron `safeStorage` ile şifrelenir.
- Dosya izinleri `0600` olarak ayarlanır.
- SteamID64 gizli değildir; API anahtarı gizli kabul edilir.
- Bağış veya ödeme bilgisi bu sürümde yoktur.
- Profil gizliyse Steam API boş/eksik sonuç döndürebilir.

## Kullanım

1. Steam Web API anahtarını Steam’in resmî sayfasından oluşturun.
2. SteamID64’ünüzü girin.
3. `Güvenli kaydet` seçeneğine tıklayın.
4. `İstatistikleri getir` ile oyun saatlerini ve başarımları yükleyin.
