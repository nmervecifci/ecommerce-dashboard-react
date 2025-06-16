// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // GraphQL için ayrı proxy
      "/api/shopify/graphql": {
        target: "https://05rpbe-yj.myshopify.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(
            /^\/api\/shopify\/graphql/,
            "/admin/api/2024-01/graphql.json"
          ),
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log(
              "Proxy request to:",
              proxyReq.getHeader("host") + proxyReq.path
            );
          });
        },
      },

      // REST API için ayrı proxy
      "/api/shopify/rest": {
        target: "https://YOUR-STORE.myshopify.com", // ← BURAYA KENDİ DOMAIN'İNİ YAZ
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(/^\/api\/shopify\/rest/, "/admin/api/2024-01"),
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("Proxy error:", err);
          });
        },
      },
    },
  },
});
