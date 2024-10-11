// vite.config.js
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "file:///D:/projects/tma-marble-race/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { defineConfig } from "file:///D:/projects/tma-marble-race/node_modules/vite/dist/node/index.js";
import basicSsl from "file:///D:/projects/tma-marble-race/node_modules/@vitejs/plugin-basic-ssl/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/projects/tma-marble-race/frontend/vite.config.js";
var vite_config_default = defineConfig({
  base: "/",
  plugins: [
    // Allows using React dev server along with building a React application with Vite.
    // https://npmjs.com/package/@vitejs/plugin-react-swc
    react(),
    // Allows using self-signed certificates to run the dev server using HTTPS.
    // https://www.npmjs.com/package/@vitejs/plugin-basic-ssl
    basicSsl()
  ],
  publicDir: "./public",
  resolve: {
    alias: {
      "@": resolve(dirname(fileURLToPath(__vite_injected_original_import_meta_url)), "./src")
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        ws: true
      }
    },
    host: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFx0bWEtbWFyYmxlLXJhY2VcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHByb2plY3RzXFxcXHRtYS1tYXJibGUtcmFjZVxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvamVjdHMvdG1hLW1hcmJsZS1yYWNlL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGlybmFtZSwgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCc7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IGJhc2ljU3NsIGZyb20gJ0B2aXRlanMvcGx1Z2luLWJhc2ljLXNzbCc7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJhc2U6ICcvJyxcclxuICBwbHVnaW5zOiBbXHJcbiAgICAvLyBBbGxvd3MgdXNpbmcgUmVhY3QgZGV2IHNlcnZlciBhbG9uZyB3aXRoIGJ1aWxkaW5nIGEgUmVhY3QgYXBwbGljYXRpb24gd2l0aCBWaXRlLlxyXG4gICAgLy8gaHR0cHM6Ly9ucG1qcy5jb20vcGFja2FnZS9Adml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcclxuICAgIHJlYWN0KCksXHJcbiAgICAvLyBBbGxvd3MgdXNpbmcgc2VsZi1zaWduZWQgY2VydGlmaWNhdGVzIHRvIHJ1biB0aGUgZGV2IHNlcnZlciB1c2luZyBIVFRQUy5cclxuICAgIC8vIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL0B2aXRlanMvcGx1Z2luLWJhc2ljLXNzbFxyXG4gICAgYmFzaWNTc2woKSxcclxuICBdLFxyXG4gIHB1YmxpY0RpcjogJy4vcHVibGljJyxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHJlc29sdmUoZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpLCAnLi9zcmMnKSxcclxuICAgIH1cclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogNTE3MyxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvYXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMCcsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgd3M6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgaG9zdDogdHJ1ZVxyXG4gIH0sXHJcbn0pO1xyXG5cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUyxTQUFTLFNBQVMsZUFBZTtBQUN2VSxTQUFTLHFCQUFxQjtBQUM5QixPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxjQUFjO0FBSmtLLElBQU0sMkNBQTJDO0FBT3hPLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQTtBQUFBO0FBQUEsSUFHUCxNQUFNO0FBQUE7QUFBQTtBQUFBLElBR04sU0FBUztBQUFBLEVBQ1g7QUFBQSxFQUNBLFdBQVc7QUFBQSxFQUNYLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxRQUFRLGNBQWMsd0NBQWUsQ0FBQyxHQUFHLE9BQU87QUFBQSxJQUMvRDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLElBQUk7QUFBQSxNQUNOO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
