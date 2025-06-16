# Components Dokümantasyonu

## Genel Bakış

React bileşenlerinin detaylı dokümantasyonu ve kullanım kılavuzları.

## SalesFunnel.jsx

### Açıklama

Ana dashboard bileşeni. REST ve GraphQL API'lerini karşılaştıran satış analitik paneli.

### Özellikler

- **Dual API Desteği** - REST ve GraphQL arasında geçiş
- **Performans Ölçümü** - Yanıt süreleri ve istek sayısı takibi
- **Real-time Toggle** - API modları arası anlık geçiş

### Props

```jsx
// Bu bileşen hiçbir prop almaz
<SalesFunnel />
```

### State Yönetimi

#### products

```jsx
const [products, setProducts] = useState([]);
```

- **Tip**: Array
- **Açıklama**: Ürün listesini tutar
- **Varsayılan**: Boş array
- **Güncelleme**: API çağrısı sonrası

#### sales

```jsx
const [sales, setSales] = useState([]);
```

- **Tip**: Array
- **Açıklama**: Satış verilerini tutar
- **Varsayılan**: Boş array
- **Güncelleme**: API çağrısı sonrası

#### apiMode

```jsx
const [apiMode, setApiMode] = useState("REST");
```

- **Tip**: String ('REST' | 'GraphQL')
- **Açıklama**: Aktif API modunu belirtir
- **Varsayılan**: 'REST'
- **Güncelleme**: Toggle butonu ile

#### responseTime

```jsx
const [responseTime, setResponseTime] = useState(null);
```

- **Tip**: Number | null
- **Açıklama**: API yanıt süresini milisaniye cinsinden tutar
- **Varsayılan**: null
- **Güncelleme**: Her API çağrısı sonrası

#### requestCount

```jsx
const [requestCount, setRequestCount] = useState(0);
```

- **Tip**: Number
- **Açıklama**: Yapılan HTTP istek sayısını tutar
- **Varsayılan**: 0
- **Güncelleme**: API çağrısı sonrası (REST: 2, GraphQL: 1)

### Ana Fonksiyonlar

#### getDataREST()

```jsx
async function getDataREST() {
  const startTime = Date.now();

  const { data: productsData } = await supabase.from("products").select();
  const { data: salesData } = await supabase.from("sales").select();

  const endTime = Date.now();

  setProducts(productsData);
  setSales(salesData);
  setResponseTime(endTime - startTime);
  setRequestCount(2);
}
```

- **Amaç**: REST API ile veri çekme
- **İstek Sayısı**: 2 (products + sales)
- **Performans**: Paralel istekler
- **Dönüş**: State güncellemesi

#### getDataGraphQL()

```jsx
async function getDataGraphQL() {
  const startTime = Date.now();

  const query = `
    query {
      productsCollection { ... }
      salesCollection { ... }
    }
  `;

  const response = await fetch(`${SUPABASE_URL}/graphql/v1`, {
    method: 'POST',
    headers: { ... },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();
  const endTime = Date.now();

  // Data processing ve state güncelleme
}
```

- **Amaç**: GraphQL API ile veri çekme
- **İstek Sayısı**: 1 (tek query)
- **Performans**: Tek istek, çoklu veri
- **Dönüş**: State güncellemesi

#### getData()

```jsx
async function getData() {
  if (apiMode === "REST") {
    await getDataREST();
  } else {
    await getDataGraphQL();
  }
}
```

- **Amaç**: API mode'una göre doğru fonksiyonu çağırma
- **Conditional Logic**: apiMode state'ine göre dallanma
- **Abstraction**: API logic'i ayırma

### Lifecycle

#### Component Mount

```jsx
useEffect(() => {
  getData();
}, [apiMode]);
```

- **Tetikleyici**: Component mount + apiMode değişimi
- **Davranış**: Otomatik veri çekme
- **Dependency**: [apiMode] - sadece API modu değişince çalışır

### UI Bileşenleri

#### API Toggle Button

```jsx
<button
  onClick={() => setApiMode(apiMode === "REST" ? "GraphQL" : "REST")}
  className={`px-4 py-2 rounded font-bold ${
    apiMode === "REST" ? "bg-blue-500 text-white" : "bg-pink-500 text-white"
  }`}
>
  {apiMode} Mode
</button>
```

- **Dinamik Styling**: API mode'una göre renk değişimi
- **Toggle Logic**: REST ↔ GraphQL geçiş
- **User Feedback**: Aktif modu gösterir

#### Performance Display

```jsx
{
  responseTime && (
    <div className="mt-3 text-sm text-gray-600">
      ⚡ Response Time: <strong>{responseTime}ms</strong> • 📡 Requests:{" "}
      <strong>{requestCount}</strong>
    </div>
  );
}
```

- **Conditional Rendering**: Sadece veri varsa gösterir
- **Metrics Display**: Performans verilerini sunar
- **Icon Usage**: Visual clarity için emojiler

#### Products Grid

```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {products.map((product) => (
    <div key={product.id} className="bg-white p-4 rounded shadow">
      <h3 className="font-bold">{product.name}</h3>
      <p>₺{product.price}</p>
    </div>
  ))}
</div>
```

- **Responsive Grid**: Mobile-first yaklaşım
- **Dynamic Rendering**: Array.map() ile liste
- **Styling**: Tailwind utility classes

#### Sales List

```jsx
<div className="space-y-2">
  {sales.slice(0, 5).map((sale, index) => (
    <div
      key={sale.id}
      className="bg-white p-3 rounded shadow flex justify-between"
    >
      <span>Satış #{index + 1}</span>
      <span className="font-bold">₺{sale.total_amount}</span>
    </div>
  ))}
</div>
```

- **Limited Display**: İlk 5 satış
- **User-friendly ID**: Index tabanlı numara
- **Flexbox Layout**: Justification için

### Hata Yönetimi

#### API Hataları

```jsx
try {
  // API çağrısı
} catch (error) {
  console.error("API Error:", error);
  // Kullanıcıya hata mesajı gösterme
}
```

- **Try/Catch**: API hatalarını yakalar
- **Error Logging**: Console'a detay
- **User Feedback**: Hata durumu bildirimi

#### Network Hataları

```jsx
if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}
```

- **HTTP Status Check**: Response doğrulama
- **Detailed Errors**: Status code ile hata mesajı
- **Error Propagation**: Üst katmana iletme

### Performance Optimizasyonları

#### useEffect Dependency

```jsx
useEffect(() => {
  getData();
}, [apiMode]); // Sadece apiMode değişince çalışır
```

- **Precision**: Gereksiz re-render'ları önler
- **Efficiency**: Sadece gerekli güncellemeler

#### Data Slicing

```jsx
{sales.slice(0, 5).map(...)}
```

- **Limited Rendering**: Performans için sınırlama
- **UX**: Sayfa yavaşlamasını önler

### Kullanım Örnekleri

#### Temel Kullanım

```jsx
import SalesFunnel from "./SalesFunnel";

function App() {
  return (
    <div>
      <SalesFunnel />
    </div>
  );
}
```

#### Environment Setup

```jsx
// .env dosyası gerekli
VITE_SUPABASE_URL = your_supabase_url;
VITE_SUPABASE_ANON_KEY = your_anon_key;
```

### Test Senaryoları

#### API Mode Toggle

1. Sayfa yüklendiğinde REST modu aktif
2. GraphQL butonuna tıkla
3. Performance metrics'lerin değiştiğini gözlemle
4. Veri tutarlılığını kontrol et

#### Performance Comparison

1. REST mode'da response time'ı not et
2. GraphQL mode'a geç
3. Response time farkını karşılaştır
4. Request count farkını gözlemle

### Gelecek Geliştirmeler

#### Planlanan Özellikler

- **Loading States** - API çağrısı sırasında loading gösterim
- **Error Boundaries** - Hata durumlarında fallback UI
- **Data Caching** - Repeated calls için cache mekanizması
- **Real-time Updates** - Supabase real-time subscriptions
