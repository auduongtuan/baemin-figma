// vite.config.js
import react from "file:///Users/tuan.au/Work/baemin-figma/node_modules/.pnpm/@vitejs+plugin-react@2.2.0_vite@3.2.5/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import { defineConfig } from "file:///Users/tuan.au/Work/baemin-figma/node_modules/.pnpm/vite@3.2.5_sass@1.56.2/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/tuan.au/Work/baemin-figma/node_modules/.pnpm/vite-plugin-dts@2.1.0_vite@3.2.5/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/tuan.au/Work/baemin-figma/packages/ds";
var vite_config_default = defineConfig({
  build: {
    lib: {
      entry: {
        index: path.resolve(__vite_injected_original_dirname, "./src/index.tsx")
      },
      name: "ds",
      fileName: "index",
      formats: ["es", "cjs", "umd"]
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
  },
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-styled-components"]
      }
    }),
    dts({
      insertTypesEntry: true
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdHVhbi5hdS9Xb3JrL2JhZW1pbi1maWdtYS9wYWNrYWdlcy9kc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3R1YW4uYXUvV29yay9iYWVtaW4tZmlnbWEvcGFja2FnZXMvZHMvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3R1YW4uYXUvV29yay9iYWVtaW4tZmlnbWEvcGFja2FnZXMvZHMvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xuXG4vLyBjb25zdCBmaWxlcyA9IGdsb2Iuc3luYyhbJy4vc3JjL3tjb21wb25lbnRzLGNvbXBvc2FibGVzfS8qKi8qLnt2dWUsanN9J10pXG4vLyAgIC5tYXAoZmlsZSA9PiB7XG4vLyAgICAgY29uc3Qga2V5ID0gZmlsZS5tYXRjaCgvKD88PVxcLlxcL3NyY1xcLykuKig/PVxcLmpzfFxcLnZ1ZSkvKTtcbi8vICAgICByZXR1cm4gW2tleVswXSwgZmlsZV07XG4vLyAgIH0pO1xuLy8gY29uc3QgZW50cmllcyA9IE9iamVjdC5mcm9tRW50cmllcyhmaWxlcyk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeToge1xuICAgICAgICBpbmRleDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9pbmRleC50c3hcIilcbiAgICAgICAgLy8gYWNjb3JkaW9uOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9BY2NvcmRpb24udHN4XCIpLFxuICAgICAgICAvLyBidXR0b246IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL0J1dHRvbi50c3hcIiksXG4gICAgICB9LFxuICAgICAgXG4gICAgICBuYW1lOiBcImRzXCIsXG4gICAgICBmaWxlTmFtZTogXCJpbmRleFwiLFxuICAgICAgZm9ybWF0czogW1wiZXNcIiwgXCJjanNcIiwgXCJ1bWRcIl0sXG4gICAgICAvLyBmaWxlTmFtZTogKGZvcm1hdCwgZW50cnlOYW1lKSA9PiBgJHtlbnRyeU5hbWV9LiR7Zm9ybWF0fS5qc2AsXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogW1wicmVhY3RcIiwgXCJyZWFjdC1kb21cIiwgXCJzdHlsZWQtY29tcG9uZW50c1wiXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgcmVhY3Q6IFwiUmVhY3RcIixcbiAgICAgICAgICBcInJlYWN0LWRvbVwiOiBcIlJlYWN0RE9NXCIsXG4gICAgICAgICAgXCJzdHlsZWQtY29tcG9uZW50c1wiOiBcInN0eWxlZFwiLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3Qoe1xuICAgICAgLy8ganN4SW1wb3J0U291cmNlOiBcIkBlbW90aW9uL3JlYWN0XCIsXG4gICAgICBiYWJlbDoge1xuICAgICAgICBwbHVnaW5zOiBbXCJiYWJlbC1wbHVnaW4tc3R5bGVkLWNvbXBvbmVudHNcIl0sXG4gICAgICB9LFxuICAgIH0pLFxuICAgIGR0cyh7XG4gICAgICBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxuICAgIH0pLFxuICBdLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNULE9BQU8sV0FBVztBQUN4VSxPQUFPLFVBQVU7QUFDakIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBSGhCLElBQU0sbUNBQW1DO0FBWXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxRQUNMLE9BQU8sS0FBSyxRQUFRLGtDQUFXLGlCQUFpQjtBQUFBLE1BR2xEO0FBQUEsTUFFQSxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsTUFDVixTQUFTLENBQUMsTUFBTSxPQUFPLEtBQUs7QUFBQSxJQUU5QjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLFNBQVMsYUFBYSxtQkFBbUI7QUFBQSxNQUNwRCxRQUFRO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxPQUFPO0FBQUEsVUFDUCxhQUFhO0FBQUEsVUFDYixxQkFBcUI7QUFBQSxRQUN2QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BRUosT0FBTztBQUFBLFFBQ0wsU0FBUyxDQUFDLGdDQUFnQztBQUFBLE1BQzVDO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxJQUFJO0FBQUEsTUFDRixrQkFBa0I7QUFBQSxJQUNwQixDQUFDO0FBQUEsRUFDSDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
