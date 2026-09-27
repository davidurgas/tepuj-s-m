import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path pre nasadenie (GitHub Pages posiela VITE_BASE="/tepuj-s-m/").
  base: process.env.VITE_BASE || "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  build: {
    // dve appky v jednom nasadení: Rep (index.html) a Zákazky (obstaravania.html)
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        obstaravania: path.resolve(__dirname, "obstaravania.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
