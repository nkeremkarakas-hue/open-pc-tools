# Oyun kayıtları, fiyatlar ve sistem performansı

## Oyun kayıtları

Steam oyunu başlatıldığında uygulama yerel cihazda oyun adı, Steam AppID, kaynak ve başlatma zamanını saklar. Son 500 kayıt tutulur. Kayıtlar kullanıcı veri klasöründe bulunur ve uygulama dışına gönderilmez.

Bu sürüm başlatma geçmişidir; oyun içi gerçek oynama süresi için Steam Web API veya oyun istemcisi verisi ayrıca gerekir.

## Güncel fiyatlar

Steam oyun kartlarındaki ₺ düğmesi Steam Store fiyat API’sini Türkiye bölgesi (`cc=tr`) ve Türkçe dil parametresiyle sorgular. Fiyat değişebilir, önbelleğe alınmaz ve satın alma işlemi uygulama içinden yapılmaz. Son doğrulama ve ödeme Steam mağazasında gerçekleşir.

## Sistem performansı

Panel CPU çekirdeği, model adı, bellek toplam/boş/kullanım oranı, çalışma süresi, yük ve işletim sisteminin sunduğu sıcaklık sensörlerini gösterir. Donanım üreticisi tarafından genel API ile sağlanmayan bellek yıpranması ve “çip kalitesi” güvenilir bir sayı değildir; uygulama bunları tahmin etmez ve `unavailable`/`not-measurable` olarak gösterir.

Performans profilleri öneri sunar ancak BIOS, sürücü veya güç ayarlarını kullanıcı onayı olmadan değiştirmez.
