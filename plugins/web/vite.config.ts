import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // optimizeDeps: {
  //   include: ['ds'],
  // },
  // resolve: {
  //   alias: [
  //     {
  //       find: "ds",
  //       replacement: path.resolve(
  //         __dirname,
  //         "../../packages/ds/"
  //       )
  //     }
  //   ]
  // }
});
