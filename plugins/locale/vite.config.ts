import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteSingleFile } from "vite-plugin-singlefile";
// import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./src/ui/",
  plugins: [
    react({ plugins: [["@swc/plugin-styled-components", {}]] }),
    viteSingleFile(),
  ],
  // server: {
  //   watch: {
  //     ignored: ['!**/node_modules/ds/**']
  //   }
  // },
  build: {
    target: "esnext",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    reportCompressedSize: false,
    outDir: "../../dist",

    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
      // input: {
      //   "index": './src/ui/index.html'
      // }, // default      },
      // output: {
      //   dir: "./dist",
      // }
      // output: {
      //   manualChunks: () => "everything.js",
      // },
    },
  },
  // optimizeDeps: {
  //   exclude: ['ds'],
  //   // exclude: ['react-hook-form'],
  // }
});
