import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPath from "vite-tsconfig-paths";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPath()],
  base: "/project-albite/",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // strip up to 'node_modules/'
            const parts = id
              .split("node_modules/")[1]
              .split("/");
            // handle scoped packages
            const pkgName = parts[0].startsWith("@")
              ? `${parts[0]}/${parts[1]}`
              : parts[0];
            // prefix to avoid collision with your own code
            return `vendor-${pkgName}`;
          }
        },
      },
    },
  },
});

