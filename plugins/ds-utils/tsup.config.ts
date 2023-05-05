import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/code.ts"],
  format: "iife",
  splitting: false,
  sourcemap: "inline",
  target: "es6",
  clean: true,
  bundle: true,
  minifyWhitespace: true,
});
