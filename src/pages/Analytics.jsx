import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Analytics() {
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeChart, setActiveChart] = useState("sales");

  const mockSalesData = [
    { name: "1 Oca", revenue: 4000, orders: 24 },
    { name: "2 Oca", revenue: 3000, orders: 18 },
    { name: "3 Oca", revenue: 2000, orders: 12 },
    { name: "4 Oca", revenue: 2780, orders: 15 },
    { name: "5 Oca", revenue: 1890, orders: 9 },
    { name: "6 Oca", revenue: 2390, orders: 16 },
    { name: "7 Oca", revenue: 3490, orders: 22 },
  ];

  const mockCategoryData = [
    { name: "Meyve", value: 4500, color: "#8884d8" },
    { name: "Sebze", value: 3200, color: "#82ca9d" },
    { name: "Fırın Ürünleri", value: 2800, color: "#ffc658" },
    { name: "Süt Ürünleri", value: 2100, color: "#ff7300" },
    { name: "Kahvaltılık", value: 1800, color: "#00ff88" },
  ];

  // 3. Gerçek Supabase API çağrısı
  const fetchDataFromSupabase = async () => {
    setLoading(true);

    try {
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("created_at, total_amount")
        .order("created_at", { ascending: true });

      if (ordersError) throw ordersError;

      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select("category, price, quantity");

      if (itemsError) throw itemsError;

      if (orders && orders.length > 0) {
        const salesByDate = {};

        orders.forEach((order) => {
          const date = new Date(order.created_at).toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "short",
          });

          if (!salesByDate[date]) {
            salesByDate[date] = { name: date, revenue: 0, orders: 0 };
          }

          salesByDate[date].revenue += Number(order.total_amount) || 0;
          salesByDate[date].orders += 1;
        });

        const salesArray = Object.values(salesByDate);
        setSalesData(salesArray);
      } else {
        // Veri yoksa mock data kullan
        setSalesData(mockSalesData);
      }

      if (items && items.length > 0) {
        const categoryTotals = {};
        const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff88"];

        items.forEach((item) => {
          const category = item.category || "Diğer";
          const revenue =
            (Number(item.price) || 0) * (Number(item.quantity) || 0);

          if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
          }
          categoryTotals[category] += revenue;
        });

        const categoryArray = Object.keys(categoryTotals).map(
          (category, index) => ({
            name: category,
            value: categoryTotals[category],
            color: colors[index % colors.length],
          })
        );

        setCategoryData(categoryArray);
      } else {
        setCategoryData(mockCategoryData);
      }

      console.log("✅ Supabase verisi başarıyla yüklendi!");
    } catch (error) {
      console.error("❌ Supabase API hatası:", error);

      setSalesData(mockSalesData);
      setCategoryData(mockCategoryData);

      alert("Veritabanı bağlantısı kurulamadı. Test verileri gösteriliyor.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDataFromSupabase();
  }, []);

  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const averageOrder =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-600">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Başlık */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          📊 Analytics Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          {salesData.length > 0 && salesData !== mockSalesData
            ? "🟢 Supabase verisi kullanılıyor"
            : "🟡 Test verisi kullanılıyor"}
        </p>
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">💰</div>
          <div className="text-2xl font-bold text-green-600">
            ₺{totalRevenue.toLocaleString("tr-TR")}
          </div>
          <p className="text-sm text-gray-600">Toplam Gelir</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">📦</div>
          <div className="text-2xl font-bold text-blue-600">{totalOrders}</div>
          <p className="text-sm text-gray-600">Toplam Sipariş</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">💵</div>
          <div className="text-2xl font-bold text-orange-600">
            ₺{averageOrder}
          </div>
          <p className="text-sm text-gray-600">Ortalama Sipariş</p>
        </div>
      </div>

      {/* Chart Seçim Butonları */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setActiveChart("sales")}
          className={`px-4 py-2 rounded ${
            activeChart === "sales"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          📈 Satış Trendi
        </button>
        <button
          onClick={() => setActiveChart("categories")}
          className={`px-4 py-2 rounded ${
            activeChart === "categories"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          📊 Kategoriler
        </button>
      </div>

      {/* Chart Alanı */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          {activeChart === "sales"
            ? "📈 Günlük Satış Trendi"
            : "📊 Kategori Dağılımı"}
        </h3>

        <div style={{ width: "100%", height: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === "sales" ? (
              // Satış Grafiği
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue"
                      ? `₺${value.toLocaleString("tr-TR")}`
                      : value,
                    name === "revenue" ? "Gelir" : "Sipariş",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
              </AreaChart>
            ) : (
              // Kategori Grafiği
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                {/* Bar Chart */}
                <div>
                  <h4 className="text-center mb-2 font-medium">
                    Gelir Miktarı
                  </h4>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          `₺${value.toLocaleString("tr-TR")}`,
                          "Gelir",
                        ]}
                      />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div>
                  <h4 className="text-center mb-2 font-medium">
                    Yüzde Dağılımı
                  </h4>
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} %${(percent * 100).toFixed(0)}`
                        }
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `₺${value.toLocaleString("tr-TR")}`,
                          "Gelir",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* En İyi Kategoriler */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🏆 En İyi Kategoriler</h3>
        <div className="space-y-3">
          {categoryData.slice(0, 3).map((category, index) => (
            <div
              key={category.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </span>
                <span className="font-medium">{category.name}</span>
              </div>
              <span className="text-green-600 font-bold">
                ₺{category.value.toLocaleString("tr-TR")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Butonu */}
      <div className="text-center">
        <button
          onClick={fetchDataFromSupabase}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "🔄 Yükleniyor..." : "🔄 Verileri Yenile"}
        </button>
      </div>
    </div>
  );
}

export default Analytics;
