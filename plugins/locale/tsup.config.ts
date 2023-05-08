import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    code: "src/command/code.ts",
  },
  format: "iife",
  splitting: false,
  sourcemap: false,
  target: "es6",
  bundle: true,
  minifyWhitespace: true,
  outExtension({ format }) {
    return {
      js: `.js`,
    };
  },
});
