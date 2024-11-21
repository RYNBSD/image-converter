import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({ include: ["buffer"] }),
    VitePWA({
      registerType: "autoUpdate", // Automatically updates the service worker
      workbox: {
        runtimeCaching: [
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            urlPattern: ({ url }) => url.origin === self.origin, // Cache all same-origin assets
            handler: "CacheFirst",
            options: {
              cacheName: "static-assets",
              expiration: {
                maxEntries: 50, // Keep a max of 50 entries
                maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
              },
            },
          },
          {
            // Cache the Jimp WASM module
            urlPattern:
              /^https:\/\/cdn\.jsdelivr\.net\/npm\/@jimp\/wasm-avif@1\.6\.0\/\+esm$/,
            handler: "CacheFirst", // Prefer cache over network
            options: {
              cacheName: "jimp-wasm-avif-cache",
              expiration: {
                maxEntries: 5, // Keep a limited number of entries
                maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
              },
              cacheableResponse: {
                statuses: [0, 200], // Cache valid responses
              },
            },
          },
        ],
      },
      manifest: {
        name: "Image Converter",
        short_name: "Converter",
        description: "Convert and optimize images",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable PWA in development mode
      },
    }),
  ],
  // optimizeDeps: {
  //   exclude: ["@jsquash/avif", "@jsquash/jpeg", "@jsquash/jxl", "@jsquash/png", "@jsquash/webp"]
  // }
  // resolve: {
  //   alias: {
  //     "@": resolve(__dirname, "./src"),
  //   },
  // },
});
