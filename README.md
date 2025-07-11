# Sales Analytics Dashboard 📊

> REST ve GraphQL API performansını karşılaştıran modern satış analitik paneli

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎥 Demo

### Live Demo

🔗 **[Demo'yu Dene](https://ecommerce-dashboard-react-beta.vercel.app)**

## 📷 Screenshots

### REST API Modu

![REST API](https://github.com/user-attachments/assets/3af4a68c-0e8e-495d-9b09-94947c6cc9e7)
_REST API modu - 2 HTTP request_

### GraphQL Modu

![GraphQL API](https://github.com/user-attachments/assets/6ae91d5e-aa0b-4304-bd39-fe454405a5db)
_GraphQL modu - 1 tek query_

## ✨ Özellikler

### 🚀 Dual API Architecture

- **REST API** - Traditional multiple HTTP requests
- **GraphQL** - Single query with multiple data sources
- **Real-time Toggle** - Instant API mode switching
- **Performance Monitoring** - Response time ve request count tracking

### 📱 Modern UI/UX
- **Tailwind CSS** - Utility-first styling
- **Interactive Components** - Dynamic data visualization
- **Real-time Updates** - Live performance metrics

### 📊 Analytics Features

- **Sales Overview** - Günlük satış metrikleri
- **Product Performance** - En çok satan ürünler
- **Performance Metrics** - API response comparison
- **Data Visualization** - Clean ve modern charts

## 🛠️ Tech Stack

### Frontend

- **[React 18](https://reactjs.org/)** - Modern UI library
- **[Vite](https://vitejs.dev/)** - Fast build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **JavaScript ES6+** - Modern JavaScript

### Backend & Database

- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **REST API** - Traditional API approach
- **GraphQL** - Modern query language

### Development & Deployment

- **Git** - Version control
- **GitHub** - Code repository
- **Vercel** - Hosting platform
- **Environment Variables** - Secure configuration

## 🏗️ Architecture Diagram

```mermaid
graph TB
    A[React App] --> B{API Mode Toggle}
    B -->|REST| C[Supabase REST API]
    B -->|GraphQL| D[Supabase GraphQL API]
    C --> E[PostgreSQL Database]
    D --> E
    E --> F[(Products Table)]
    E --> G[(Sales Table)]
```

## ⚡ Performance Comparison

### API Response Times

| API Type | Request Count | Avg Response Time | Data Efficiency |
| -------- | ------------- | ----------------- | --------------- |
| REST API | 2 requests    | ~150ms            | Multiple calls  |
| GraphQL  | 1 request     | ~90ms             | Single query    |


## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm veya yarn
- Modern web browser


### Environment Setup

`.env` dosyasını düzenle:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Development Server

```bash
# Development server'ı başlat
npm run dev

# Tarayıcıda aç: http://localhost:5173
```

## 📊 Database Schema

### Tables Overview

```sql
-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2),
  stock_quantity INTEGER
);

-- Sales table
CREATE TABLE sales (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  quantity DECIMAL(8,2),
  total_amount DECIMAL(10,2),
  sale_date TIMESTAMP
);
```

![Database Schema](https://github.com/user-attachments/assets/f0c8ecba-027a-4e48-944a-d020ef61a21e)
_Veritabanı ilişki diyagramı_

## 🔧 API Examples

### REST API Calls

```javascript
// Multiple HTTP requests
const products = await supabase.from("products").select("*");
const sales = await supabase.from("sales").select("*");
```

### GraphQL Query

```graphql
query GetDashboardData {
  productsCollection {
    edges {
      node {
        id
        name
        price
      }
    }
  }
  salesCollection {
    edges {
      node {
        id
        quantity
        total_amount
      }
    }
  }
}
```

## 📖 Documentation

### Detaylı Dokümantasyon

- 📋 **[Sistem Mimarisi](src/docs/architecture.md)** - Kapsamlı mimari dokümantasyonu
- 🧩 **[Component Dokümantasyonu](src/docs/components.md)** - React bileşen detayları
- 🚀 **[Deployment Rehberi](src/docs/deployment.md)** - Step-by-step kurulum


## 🎯 Learning Outcomes

Bu proje ile öğrenilenler:

### Technical Skills

- ✅ **React Hooks** - useState, useEffect
- ✅ **API Integration** - REST ve GraphQL
- ✅ **Performance Monitoring** - Response time tracking
- ✅ **Database Design** - PostgreSQL relations

### Professional Skills

- ✅ **System Architecture** - Full-stack thinking
- ✅ **Documentation** - Comprehensive docs
- ✅ **Performance Optimization** - API comparison
- ✅ **DevOps** - Deployment strategies

## 🚀 Deployment Options

### Hosting Platforms

- **[Vercel](https://vercel.com)** - Recommended ⭐
- **[Netlify](https://netlify.com)** - Alternative
- **[GitHub Pages](https://pages.github.com)** - Free option

## 🤝 Contributing

Katkıda bulunmak için:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📧 Contact

**Developer**: Merve Nur Çifci
**Email**: mervenurcfc42@gmail.com  
**LinkedIn**:[www.linkedin.com/in/mervenurcifci]  


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Supabase](https://supabase.com)** - Amazing BaaS platform
- **[Tailwind CSS](https://tailwindcss.com)** - Excellent utility-first CSS
- **[React](https://reactjs.org)** - Powerful UI library
- **[Vercel](https://vercel.com)** - Seamless deployment experience

---

<div align="center">
  <p>⭐ Bu projeyi beğendiysen star vermeyi unutma!</p>
  <p>Made with ❤️ and lots of ☕</p>
</div>
