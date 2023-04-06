// vite.config.ts
import react from "file:///Users/tuan.au/Coding/baemin-figma/node_modules/.pnpm/@vitejs+plugin-react@2.2.0_vite@3.2.5/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "node:path";
import { defineConfig } from "file:///Users/tuan.au/Coding/baemin-figma/node_modules/.pnpm/vite@3.2.5_sass@1.56.2/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/tuan.au/Coding/baemin-figma/node_modules/.pnpm/vite-plugin-dts@2.1.0_vite@3.2.5/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/tuan.au/Coding/baemin-figma/packages/ds";
var vite_config_default = defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-styled-components"]
      }
    }),
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: {
        index: path.resolve(__vite_injected_original_dirname, "src/index.tsx"),
        accordion: path.resolve(__vite_injected_original_dirname, "src/Accordion.tsx"),
        button: path.resolve(__vite_injected_original_dirname, "src/Button.tsx")
      },
      name: "MyLib",
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      external: ["react", "react-dom", "styled-components"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "styled-components": "styled"
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdHVhbi5hdS9Db2RpbmcvYmFlbWluLWZpZ21hL3BhY2thZ2VzL2RzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdHVhbi5hdS9Db2RpbmcvYmFlbWluLWZpZ21hL3BhY2thZ2VzL2RzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy90dWFuLmF1L0NvZGluZy9iYWVtaW4tZmlnbWEvcGFja2FnZXMvZHMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IGR0cyBmcm9tIFwidml0ZS1wbHVnaW4tZHRzXCI7XG5cbi8vIGNvbnN0IGZpbGVzID0gZ2xvYi5zeW5jKFsnLi9zcmMve2NvbXBvbmVudHMsY29tcG9zYWJsZXN9LyoqLyoue3Z1ZSxqc30nXSlcbi8vICAgLm1hcChmaWxlID0+IHtcbi8vICAgICBjb25zdCBrZXkgPSBmaWxlLm1hdGNoKC8oPzw9XFwuXFwvc3JjXFwvKS4qKD89XFwuanN8XFwudnVlKS8pO1xuLy8gICAgIHJldHVybiBba2V5WzBdLCBmaWxlXTtcbi8vICAgfSk7XG4vLyBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmZyb21FbnRyaWVzKGZpbGVzKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KHtcbiAgICAgIC8vIGpzeEltcG9ydFNvdXJjZTogXCJAZW1vdGlvbi9yZWFjdFwiLFxuICAgICAgYmFiZWw6IHtcbiAgICAgICAgcGx1Z2luczogW1wiYmFiZWwtcGx1Z2luLXN0eWxlZC1jb21wb25lbnRzXCJdLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBkdHMoe1xuICAgICAgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSxcbiAgICB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiB7XG4gICAgICAgIGluZGV4OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9pbmRleC50c3hcIiksXG4gICAgICAgIGFjY29yZGlvbjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvQWNjb3JkaW9uLnRzeFwiKSxcbiAgICAgICAgYnV0dG9uOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9CdXR0b24udHN4XCIpLFxuICAgICAgfSxcbiAgICAgIG5hbWU6IFwiTXlMaWJcIixcbiAgICAgIGZvcm1hdHM6IFtcImVzXCIsIFwiY2pzXCJdLFxuICAgICAgLy8gZmlsZU5hbWU6IChmb3JtYXQsIGVudHJ5TmFtZSkgPT4gYCR7ZW50cnlOYW1lfS4ke2Zvcm1hdH0uanNgLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCIsIFwic3R5bGVkLWNvbXBvbmVudHNcIl0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZ2xvYmFsczoge1xuICAgICAgICAgIHJlYWN0OiBcIlJlYWN0XCIsXG4gICAgICAgICAgXCJyZWFjdC1kb21cIjogXCJSZWFjdERPTVwiLFxuICAgICAgICAgIFwic3R5bGVkLWNvbXBvbmVudHNcIjogXCJzdHlsZWRcIixcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VCxPQUFPLFdBQVc7QUFDOVUsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUhoQixJQUFNLG1DQUFtQztBQVl6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsTUFFSixPQUFPO0FBQUEsUUFDTCxTQUFTLENBQUMsZ0NBQWdDO0FBQUEsTUFDNUM7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELElBQUk7QUFBQSxNQUNGLGtCQUFrQjtBQUFBLElBQ3BCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPO0FBQUEsUUFDTCxPQUFPLEtBQUssUUFBUSxrQ0FBVyxlQUFlO0FBQUEsUUFDOUMsV0FBVyxLQUFLLFFBQVEsa0NBQVcsbUJBQW1CO0FBQUEsUUFDdEQsUUFBUSxLQUFLLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQUEsTUFDbEQ7QUFBQSxNQUNBLE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxJQUV2QjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLFNBQVMsYUFBYSxtQkFBbUI7QUFBQSxNQUNwRCxRQUFRO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxPQUFPO0FBQUEsVUFDUCxhQUFhO0FBQUEsVUFDYixxQkFBcUI7QUFBQSxRQUN2QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
