import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { workflow } from "workflow/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), workflow()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname),
      "@": path.resolve(__dirname, "app"),
    },
  },
});
