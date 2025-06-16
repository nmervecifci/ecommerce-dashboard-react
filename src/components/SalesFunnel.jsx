import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function SalesFunnel() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [apiMode, setApiMode] = useState("REST");
  const [responseTime, setResponseTime] = useState(null);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    getData();
  }, [apiMode]);

  // REST API
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

  // GraphQL API
  async function getDataGraphQL() {
    const startTime = Date.now();

    const query = `
      query {
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
    `;

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/graphql/v1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ query }),
      }
    );

    const result = await response.json();
    const endTime = Date.now();

    const productsData =
      result.data?.productsCollection?.edges?.map((edge) => edge.node) || [];
    const salesData =
      result.data?.salesCollection?.edges?.map((edge) => edge.node) || [];

    setProducts(productsData);
    setSales(salesData);
    setResponseTime(endTime - startTime);
    setRequestCount(1);
  }

  async function getData() {
    if (apiMode === "REST") {
      await getDataREST();
    } else {
      await getDataGraphQL();
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🍎 Satış Dashboard</h1>

      <div className="mb-6">
        <button
          onClick={() => setApiMode(apiMode === "REST" ? "GraphQL" : "REST")}
          className={`px-4 py-2 rounded font-bold ${
            apiMode === "REST"
              ? "bg-blue-500 text-white"
              : "bg-pink-500 text-white"
          }`}
        >
          {apiMode} Mode
        </button>

        {/* Performance Stats */}
        {responseTime && (
          <div className="mt-3 text-sm text-gray-600">
            ⚡ Response Time: <strong>{responseTime}ms</strong> • 📡 Requests:{" "}
            <strong>{requestCount}</strong>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-3">
          📦 Ürünler ({products.length})
        </h2>
        <div className="grid grid-cols-3  gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded shadow">
              <h3 className="font-bold">{product.name}</h3>
              <p>₺{product.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">💰 Satışlar ({sales.length})</h2>
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
      </div>
    </div>
  );
}

export default SalesFunnel;
