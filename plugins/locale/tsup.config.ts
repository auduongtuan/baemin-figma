import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    code: "src/command/code.ts",
  },
  format: "iife",
  splitting: false,
  sourcemap: "inline",
  target: "es6",
  bundle: true,
  minifyWhitespace: true,
  outExtension({ format }) {
    return {
      js: `.js`,
    };
  },
});
