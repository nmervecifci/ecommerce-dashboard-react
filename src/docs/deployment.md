# Deployment Rehberi

## Genel Bakış

Sales Analytics Dashboard'un yerel kurulumdan production deployment'a kadar tüm adımları.

## Ön Gereksinimler

### Sistem Gereksinimleri

- **Node.js** - v18.0.0 veya üzeri
- **npm** - v8.0.0 veya üzeri (Node.js ile birlikte gelir)
- **Git** - Version control için
- **Modern Tarayıcı** - Chrome, Firefox, Safari, Edge

### Gerekli Hesaplar

- **GitHub** - Kod repository için
- **Supabase** - Database ve API için
- **Vercel/Netlify** - Hosting için (opsiyonel)

### Kurulum Kontrolü

```bash
# Node.js versiyonunu kontrol et
node --version
# v18.0.0 veya üzeri olmalı

# npm versiyonunu kontrol et
npm --version
# v8.0.0 veya üzeri olmalı

# Git kurulumunu kontrol et
git --version
```

## Yerel Kurulum

### 1. Repository Klonlama

```bash
# GitHub'dan klonla
git clone https://github.com/yourusername/sales-dashboard.git

# Proje klasörüne geç
cd sales-dashboard

# Klasör içeriğini kontrol et
ls -la
```

### 2. Bağımlılıkları Yükleme

```bash
# npm ile paket yükleme
npm install

# Alternatif: yarn kullanıyorsan
yarn install

# Yükleme sonrası kontrol
ls node_modules/
```

### 3. Environment Variables Kurulumu

#### .env Dosyası Oluşturma

```bash
# Proje root'unda .env dosyası oluştur
touch .env

# Veya Windows'ta
echo. > .env
```

#### .env Dosyası İçeriği

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Development Settings
VITE_APP_ENV=development
VITE_API_BASE_URL=https://your-project.supabase.co
```

#### Supabase Bilgilerini Alma

1. **Supabase Dashboard'a git** - https://app.supabase.com
2. **Projenizi seçin**
3. **Settings → API** menüsüne gidin
4. **Project URL** ve **anon/public key** kopyalayın

### 4. Geliştirme Sunucusunu Başlatma

```bash
# Development server'ı başlat
npm run dev

# Alternatif: yarn
yarn dev

# Terminal çıktısı:
#   VITE v4.4.5  ready in 500 ms
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: use --host to expose
```

### 5. İlk Çalıştırma Kontrolü

1. **Tarayıcıda aç** - http://localhost:5173
2. **Console kontrol** - F12 → Console (hata var mı?)
3. **API connection test** - Toggle butonlarını dene
4. **Data loading** - Ürün ve satış verilerini kontrol et

## Supabase Database Kurulumu

### 1. Yeni Proje Oluşturma

```sql
-- Supabase SQL Editor'da çalıştır

-- Products tablosu
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales tablosu
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  quantity DECIMAL(8,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Sample Data Ekleme

```sql
-- Örnek ürünler
INSERT INTO products (name, price, stock_quantity) VALUES
('Elma', 25.50, 100),
('Armut', 30.00, 80),
('Portakal', 22.75, 120),
('Muz', 18.00, 200),
('Çilek', 45.00, 50);

-- Örnek satışlar
INSERT INTO sales (product_id, quantity, total_amount) VALUES
((SELECT id FROM products WHERE name = 'Elma'), 2.5, 63.75),
((SELECT id FROM products WHERE name = 'Armut'), 1.0, 30.00),
((SELECT id FROM products WHERE name = 'Portakal'), 3.0, 68.25),
((SELECT id FROM products WHERE name = 'Muz'), 5.0, 90.00),
((SELECT id FROM products WHERE name = 'Çilek'), 1.5, 67.50);
```

### 3. API Permissions

```sql
-- RLS (Row Level Security) ayarları
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Public read access policy
CREATE POLICY "Enable read access for all users" ON products
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON sales
FOR SELECT USING (true);
```

### 4. GraphQL API Aktifleştirme

1. **Supabase Dashboard** → **Settings** → **API**
2. **GraphQL** sekmesine git
3. **Enable GraphQL API** toggle'ını aç
4. **Schema exposure** ayarlarını kontrol et

## Production Build

### 1. Build Oluşturma

```bash
# Production build
npm run build

# Build klasörü oluşur
ls dist/
# index.html, assets/, vite.svg

# Build boyutunu kontrol et
du -sh dist/
```

### 2. Build'i Yerel Test

```bash
# Production build'i test et
npm run preview

# Çıktı:
#   ➜  Local:   http://localhost:4173/
#   ➜  Network: use --host to expose

# Test checklist:
# - API calls çalışıyor mu?
# - Performance metrics doğru mu?
# - Responsive design bozuk mu?
# - Console'da hata var mı?
```

## Hosting Seçenekleri

### Vercel Deployment

#### Automatic Deployment

```bash
# Vercel CLI kurulumu
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Sorulara cevaplar:
# ? Set up and deploy "sales-dashboard"? Y
# ? Which scope? your-username
# ? Link to existing project? N
# ? What's your project's name? sales-dashboard
# ? In which directory is your code located? ./
```

#### Manual Deployment

1. **Vercel.com**'a git
2. **New Project** → **Import Git Repository**
3. **GitHub repository seç**
4. **Environment Variables** ekle:
   ```
   VITE_SUPABASE_URL = your_url
   VITE_SUPABASE_ANON_KEY = your_key
   ```
5. **Deploy** butonuna bas

### Netlify Deployment

#### Drag & Drop Method

```bash
# Build oluştur
npm run build

# dist/ klasörünü netlify.com'a sürükle-bırak
```

#### Git Integration

1. **Netlify.com** → **New site from Git**
2. **GitHub** seç → **Repository seç**
3. **Build settings**:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
4. **Environment variables** ekle
5. **Deploy site**

### GitHub Pages

#### GitHub Actions ile

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Environment Variables Yönetimi

### Development (.env)

```env
VITE_SUPABASE_URL=https://localhost-project.supabase.co
VITE_SUPABASE_ANON_KEY=development-key
VITE_APP_ENV=development
VITE_DEBUG=true
```

### Production

```env
VITE_SUPABASE_URL=https://production-project.supabase.co
VITE_SUPABASE_ANON_KEY=production-key
VITE_APP_ENV=production
VITE_DEBUG=false
```

### Security Best Practices

- ❌ **Secret keys** .env'e yazma
- ✅ **Public keys** .env'e yazabilirsin
- ❌ **.env dosyasını** git'e commit etme
- ✅ **.env.example** dosyası oluştur

### .env.example Dosyası

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# App Configuration
VITE_APP_ENV=development
VITE_DEBUG=true
```

## Troubleshooting

### Yaygın Hatalar

#### 1. Module Not Found

```bash
# Hata: Cannot resolve '@supabase/supabase-js'
# Çözüm:
npm install @supabase/supabase-js
```

#### 2. Environment Variables Yüklenmemiş

```bash
# Hata: Cannot read properties of undefined
# Çözüm: .env dosyasını kontrol et
echo $VITE_SUPABASE_URL
```

#### 3. API Connection Failed

```bash
# Hata: Failed to fetch
# Çözüm:
# 1. Supabase URL doğru mu?
# 2. API key valid mi?
# 3. CORS ayarları tamam mı?
```

#### 4. Build Hatası

```bash
# Hata: Build failed
# Çözüm:
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Debug Araçları

#### Console Logging

```javascript
// API çağrılarını debug et
console.log("API Mode:", apiMode);
console.log("Response Time:", responseTime);
console.log("Products:", products);
```

#### Network Tab

1. **F12** → **Network**
2. **API çağrılarını** gözlemle
3. **Response status** kontrol et
4. **Request/Response** detaylarını incele

#### React DevTools

1. **React DevTools** browser extension yükle
2. **Components tab** → State inspection
3. **Profiler tab** → Performance analysis

## Performance Optimizasyonu

### Build Optimizasyonu

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          supabase: ["@supabase/supabase-js"],
        },
      },
    },
  },
};
```

### Caching Strategy

```bash
# Vercel headers
# vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Monitoring ve Analytics

### Sentry Error Tracking

```bash
npm install @sentry/react @sentry/vite-plugin
```

### Vercel Analytics

```bash
npm install @vercel/analytics
```

### Custom Metrics

```javascript
// Performance monitoring
const trackAPICall = (apiType, responseTime) => {
  console.log(`${apiType} API: ${responseTime}ms`);
  // Analytics servisine gönder
};
```

## Maintenance

### Güncelleme Stratejisi

```bash
# Bağımlılıkları kontrol et
npm audit

# Güvenlik açıklarını düzelt
npm audit fix

# Paketleri güncelle
npm update
```

### Backup Strategy

- **Database**: Supabase otomatik backup
- **Code**: Git repository
- **Environment**: .env.example dosyası

### Monitoring Checklist

- [ ] API endpoints çalışıyor
- [ ] Performance metrics normal
- [ ] Error rates düşük
- [ ] User experience sorunsuz
