# TaskFlow

TaskFlow is a Kanban-style task management application built with Next.js and Supabase.

## Features

- User authentication (register / login)
- Create boards
- Add columns and cards
- Drag and drop cards between columns
- Persistent ordering (cards keep their position after refresh)
- Delete columns and cards
- Modern UI

## Tech Stack

- Next.js (App Router)
- Supabase (Auth + Database)
- dnd-kit (Drag & Drop)
- Tailwind CSS

## Live Demo

https://taskflow-rho-sandy.vercel.app

## Notes

The project focuses on core functionality and stability within a limited development time. Advanced features like sharing and activity logs are considered future improvements.

## Teknik Kararlar (Düşünmen Gereken Sorular)
1) Sürükle-bırak kütüphanesi seçimi: dnd-kit, @hello-pangea/dnd, SortableJS, veya tarayıcı yerleşik drag-and-drop? Her birinin artı-eksileri neler? (Hız, mobil uyumluluğu, dosya boyutu, destek durumu)

Bu projede sürükle-bırak işlemleri için **dnd-kit** tercih edilmiştir. dnd-kit modern, aktif olarak geliştirilen ve React ile uyumu yüksek bir kütüphanedir. PointerSensor ve TouchSensor desteği sayesinde hem masaüstü hem de mobil cihazlarda kullanılabilir. Ayrıca çok kolonlu Kanban yapısında kartların hem aynı kolon içinde sıralanması hem de kolonlar arasında taşınması için esnek bir yapı sunar.
Alternatiflerden **@hello-pangea/dnd**, Trello benzeri liste yapıları için kullanışlıdır ancak esneklik açısından dnd-kit kadar güçlü değildir. **SortableJS** performanslı ve olgun bir kütüphane olmasına rağmen React state yönetimiyle entegrasyonu daha manuel ilerler. Tarayıcının yerleşik drag-and-drop özelliği ise ek kütüphane gerektirmese de mobil desteği zayıf olduğu ve modern görsel geri bildirimleri yönetmek daha zor olduğu için tercih edilmemiştir.
Bu nedenle hız, mobil uyumluluk, destek durumu ve uzun vadeli sürdürülebilirlik açısından **dnd-kit** en uygun seçenek olarak değerlendirilmiştir.

2) Sıralama verisi nasıl saklanmalı? Sayfa yenileseniz bile kartların sırası kaybolmaması kritik — bunu nasıl çözersin?

Sıralama verisi, her kart için veritabanında tutulan `order_index` alanı ile saklanmaktadır. Her kartın bağlı olduğu kolon `column_id` ile, kolon içindeki sırası ise `order_index` ile belirlenir.
Kart aynı kolon içinde taşındığında ilgili kolondaki kartlar yeniden sıralanır ve her karta güncel `order_index` değeri atanır. Kart farklı bir kolona taşındığında ise hem eski kolon hem de yeni kolon yeniden indekslenir. Bu güncel değerler Supabase veritabanına kaydedildiği için sayfa yenilense bile kartlar son bırakıldıkları sırada ve kolonda kalmaya devam eder.
Bu projede daha basit ve güvenilir olması için yeniden indeksleme yöntemi kullanılmıştır. Daha büyük ölçekli sistemlerde fractional indexing veya batch update gibi yöntemler tercih edilebilir.

3) Mobil cihazlarda sürükle-bırak nasıl çalışacak? Uzun basma mı, alternatif bir mekanizma mı? Mobil uygulama yazmanı beklemiyoruz ama uygulama tasarımının mobil cihazlarda düzgün görünmesini bekliyoruz.

Mobil cihazlarda sürükle-bırak işlemleri için dnd-kit’in `TouchSensor` özelliği kullanılmıştır. Yanlışlıkla sürükleme başlamasını önlemek için kısa bir gecikme ve tolerans değeri tanımlanmıştır. Bu sayede mobilde kullanıcı kartı kısa süre basılı tuttuğunda sürükleme işlemi daha kontrollü şekilde başlar.
Ayrıca uygulama arayüzü responsive olacak şekilde tasarlanmıştır. Kolonlar küçük ekranlarda yatay kaydırılabilir yapıdadır. Böylece mobil uygulama geliştirilmemiş olsa bile web arayüzü telefonda ve tablette kullanılabilir kalır.

4) Sütunların sırası da değiştirilebilir mi olmalı?

Sütunların sırasının değiştirilebilir olması kullanıcı deneyimini artıran bir özelliktir ve özellikle daha kompleks board yapılarında faydalı olabilir. Ancak bu projede öncelik kartların kolonlar arasında taşınması ve sıralama mantığının doğru çalışmasına verilmiştir. Gelecek geliştirmelerde aynı sürükle-bırak altyapısı kullanılarak sütunların da yeniden sıralanması kolaylıkla eklenebilir.

5) Kartlara etiket, son teslim tarihi, sorumlu kişi eklemeyi düşünecek misin? Hangisi 48 saatte çalışmaya değer?

Kartlara etiket, son teslim tarihi ve sorumlu kişi eklemek projeyi daha kullanışlı hale getirebilir. Ancak 48 saatlik geliştirme süresinde öncelik temel Kanban akışının stabil çalışmasına verilmiştir. Bu nedenle ilk versiyonda kart oluşturma, kart düzenleme, silme, sürükle-bırak ve sıralamanın kalıcı olması gibi temel özelliklere odaklanılmıştır. Bu nedenle etiket, son teslim tarihi ve sorumlu kişi özellikleri gelecek geliştirmeler için planlanabilir.

6) Board paylaşma özelliği olacak mı? Varsa sadece görüntüleme mi, yoksa birlikte düzenleme mi?

Board paylaşma özelliği projeyi çok daha güçlü hale getirecek bir fonksiyondur. Ancak bu özellik kullanıcı yetkilendirme, rol yönetimi ve ek veri modeli gerektirdiği için ilk versiyonda kapsam dışında bırakılmıştır. Bu nedenle ilk kapsamında paylaşım özelliği eklenmemiş, öncelik tek kullanıcılı stabil bir sistem geliştirmeye verilmiştir. Gelecek geliştirmelerde birlikte düzenleme özelliği, rol bazlı erişim kontrolü ile birlikte eklenmesi planlanabilir.

7) Aktivite geçmişi (kartın hangi sütunlar arasında ne zaman taşındığı) değerli mi?

Aktivite geçmişi, özellikle ekip çalışması yapılan projelerde oldukça değerli bir özelliktir. Kartın hangi kullanıcı tarafından, ne zaman ve hangi sütunlar arasında taşındığını görmek süreç takibi ve şeffaflık açısından önemli avantaj sağlar ancak bu projenin ilk sürümünde temel Kanban fonksiyonlarının stabil çalışmasına öncelik verilmiştir. Aktivite geçmişi özelliği, ek bir veri modeli, zaman damgaları ve işlem kayıtları gerektirdiği için ilk versiyonda kapsam dışında bırakılmıştır. Gelecek geliştirmelerde kart oluşturma, taşıma, düzenleme ve silme gibi işlemlerin loglanması ile bu özellik kolaylıkla eklenebilir.

8) Performans: çok sayıda kart olduğunda sürükle-bırak akıcı kalıyor mu?

Mevcut yapıda sürükle-bırak işlemleri sırasında kartların sırası yeniden indekslenerek güncellenmektedir. Bu yaklaşım küçük ve orta ölçekli board’lar için yeterli performansı sağlamaktadır ve kullanıcı deneyimi akıcı kalmaktadır. Ancak çok sayıda kart içeren büyük board’larda her sürükleme işleminde tüm kartların yeniden indekslenmesi performans maliyeti oluşturabilir. Bu durumda daha gelişmiş yöntemler tercih edilebilir. Örneğin fractional indexing ile her kart için ara değerler atanarak tüm listeyi yeniden sıralama ihtiyacı azaltılabilir. Ayrıca batch update, optimistic UI ve uzun listelerde sanallaştırma (virtualization) gibi tekniklerle performans daha da iyileştirilebilir. Bu projede, basit ve güvenilir olması nedeniyle yeniden indeksleme yöntemi tercih edilmiştir.
