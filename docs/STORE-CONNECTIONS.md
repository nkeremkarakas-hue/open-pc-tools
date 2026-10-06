# Çoklu Mağaza Bağlantıları

Open PC Tools; Steam, Xbox/Microsoft, Epic Games, GOG, Ubisoft Connect, EA app, Battle.net, itch.io, Heroic ve Lutris için sağlayıcı kayıtlarını içerir.

## Güvenli akış

1. Kullanıcı uygulamadaki `Mağaza bağlantıları` panelini açar.
2. `Resmî giriş` seçeneği yalnızca sağlayıcının HTTPS giriş sayfasını açar.
3. Kullanıcı parolasını sağlayıcının kendi sayfasında girer.
4. Open PC Tools parolayı görmez ve göndermez.
5. Gerçek OAuth/PKCE token senkronizasyonu, her sağlayıcı için onaylanmış client ID ve callback URL yapılandırması eklendiğinde ayrı adapter olarak bağlanabilir.

Bu sürümde sahte bir “bağlandı” durumu gösterilmez; provider kartları yalnızca resmî login sayfasını açar. Şifreleri otomatik doldurmak veya sağlayıcıların kurallarını aşmak desteklenmez.

## Neden otomatik şifre girişi yok?

Şifreyi uygulamaya alıp başka servise aktarmak; parolanın sızması, hesap kilitlenmesi ve phishing riskini artırır. Güvenli otomasyon ancak sağlayıcının resmî OAuth/Device Code akışıyla yapılır. Tokenlar uygulamaya eklendiğinde OS güvenli kasasında saklanmalıdır.
