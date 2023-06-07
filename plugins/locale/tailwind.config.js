/** @type {import('tailwindcss').Config} */
const spacingScale = [...Array(49).keys()].reduce((acc, curr) => {
  acc[curr] = `${curr}px`;
  return acc;
}, {});
export default {
  content: [
    "./../../packages/ds/src/**/*.{js,jsx,ts,tsx,vue}",
    "./src/ui/**/*.{js,jsx,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      spacing: spacingScale,
      fontSize: {
        xsmall: "11px",
        small: "12px",
        large: "13px",
        xlarge: "14px",
      },
      textColor: {
        secondary: "var(--figma-color-text-secondary)",
      },
      borderColor: {
        divider: "var(--figma-color-border)",
      },
    },
  },
  plugins: [],
};
