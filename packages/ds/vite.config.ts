import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// const files = glob.sync(['./src/{components,composables}/**/*.{vue,js}'])
//   .map(file => {
//     const key = file.match(/(?<=\.\/src\/).*(?=\.js|\.vue)/);
//     return [key[0], file];
//   });
// const entries = Object.fromEntries(files);

export default defineConfig({
  plugins: [
    react({
      // jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["babel-plugin-styled-components"],
      },
    }),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "./src/index.tsx")
        // accordion: path.resolve(__dirname, "src/Accordion.tsx"),
        // button: path.resolve(__dirname, "src/Button.tsx"),
      },
      
      name: "ds",
      fileName: "index",
      formats: ["es", "cjs", "umd"],
      // fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "styled-components"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "styled-components": "styled",
        },
      },
    },
  },
});
