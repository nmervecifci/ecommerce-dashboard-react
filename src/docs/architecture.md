# Sistem Mimarisi

## Genel Bakış

REST ve GraphQL performansını karşılaştıran dual API yaklaşımına sahip Satış Analitik Dashboard'u.

## Frontend Mimarisi

### Teknoloji Stack'i

- **React 18** - Bileşen tabanlı UI kütüphanesi
- **Vite** - Build aracı ve geliştirme sunucusu
- **Tailwind CSS** - Utility-first CSS framework'ü
- **JavaScript ES6+** - Modern JavaScript özellikleri

### Bileşen Yapısı

```
src/
├── SalesFunnel.jsx     # Ana dashboard bileşeni
├── App.jsx             # Kök uygulama bileşeni
└── main.jsx            # Uygulama giriş noktası
```

### State Yönetimi

- **useState Hook** - Yerel bileşen state'i
- **useEffect Hook** - Yan etkiler ve veri çekme
- **Harici state kütüphanesi yok** - Basit tutma

## Backend Mimarisi

### Veritabanı

- **Supabase PostgreSQL** - Bulut tabanlı veritabanı
- **Gerçek zamanlı yetenekler** - Yerleşik real-time abonelikler
- **Satır Seviyesi Güvenlik** - Yerleşik kimlik doğrulama ve yetkilendirme

### Veritabanı Şeması

```sql
-- Ürünler tablosu
products (
  id: UUID PRIMARY KEY,
  name: TEXT,
  price: DECIMAL,
  stock_quantity: INTEGER
)

-- Satışlar tablosu
sales (
  id: UUID PRIMARY KEY,
  product_id: UUID REFERENCES products(id),
  quantity: DECIMAL,
  total_amount: DECIMAL,
  sale_date: TIMESTAMP
)
```

## API Mimarisi

### REST API Yaklaşımı

- **Çoklu HTTP İstekleri** - Her kaynak için ayrı çağrılar
- **Supabase Client** - JavaScript client kütüphanesi
- **İstek Modeli**:
  ```
  GET /rest/v1/products
  GET /rest/v1/sales
  ```

### GraphQL Yaklaşımı

- **Tek HTTP İsteği** - Çoklu kaynaklar için bir sorgu
- **Native Supabase GraphQL** - Yerleşik GraphQL endpoint'i
- **Sorgu Modeli**:
  ```graphql
  query {
    productsCollection { ... }
    salesCollection { ... }
  }
  ```

## Veri Akışı

### REST Veri Akışı

```
Bileşen → useState → useEffect → Supabase Client → REST API → Veritabanı
                                                          ↓
Bileşen ← State Güncelleme ← Veri İşleme ← API Yanıtı ←
```

### GraphQL Veri Akışı

```
Bileşen → useState → useEffect → Fetch API → GraphQL Endpoint → Veritabanı
                                                       ↓
Bileşen ← State Güncelleme ← Veri İşleme ← GraphQL Yanıtı ←
```

## Performans İzleme

### İzlenen Metrikler

- **Yanıt Süresi** - API çağrıları öncesi/sonrası `Date.now()`
- **İstek Sayısı** - Yapılan HTTP isteklerinin sayısı
- **Veri Hacmi** - Transfer edilen veri miktarı

### Uygulama

```javascript
const startTime = Date.now();
// API çağrısı
const endTime = Date.now();
const responseTime = endTime - startTime;
```

## Güvenlik

### Ortam Değişkenleri

- **VITE_SUPABASE_URL** - Public Supabase proje URL'i
- **VITE_SUPABASE_ANON_KEY** - Public anonim anahtar
- **Frontend kodda hassas veri yok**

### API Güvenliği

- **Satır Seviyesi Güvenlik** - Veritabanı seviyesi izinler
- **API Anahtar Kimlik Doğrulama** - Supabase yerleşik auth
- **CORS Konfigürasyonu** - Kontrollü cross-origin erişim

## Deployment Mimarisi

### Build Süreci

```
Kaynak Kod → Vite Build → Static Assets → Hosting Platformu
```

### Hosting Seçenekleri

- **Vercel** - React uygulamaları için önerilen
- **Netlify** - Alternatif hosting platformu
- **GitHub Pages** - Ücretsiz static hosting

## Ölçeklenebilirlik Değerlendirmeleri

### Mevcut Ölçek

- **Küçük Veri Seti** - Yüzlerce kayıt
- **Tek Kullanıcı** - Eşzamanlı erişim modelleri yok
- **Geliştirme Ortamı** - Production-ready değil

### Gelecek Ölçeklendirme

- **Önbellek Katmanı** - Sık sorgular için Redis
- **CDN Entegrasyonu** - Static asset dağıtımı
- **Veritabanı İndeksleme** - Sorgu performans optimizasyonu
- **Yük Dengeleme** - Çoklu sunucu örnekleri

## Geliştirme Ortamı

### Ön Gereksinimler

- Node.js 18+
- npm veya yarn
- Modern web tarayıcısı
- Kod editörü (VS Code önerilen)

### Yerel Kurulum

```bash
1. Repository'yi klonla
2. npm install
3. .env dosyası oluştur
4. npm run dev
```

## İzleme ve Analitik

### Performans Takibi

- **Client-side zamanlama** - JavaScript Date.now()
- **Network istekleri** - Tarayıcı geliştirici araçları
- **Bileşen render'ları** - React geliştirici araçları

### Hata Yönetimi

- **Try/catch blokları** - API hata yönetimi
- **State yönetimi** - Hata durumu takibi
- **Kullanıcı geri bildirimi** - Hata mesajı gösterimi
