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
      colors: {
        action: "rgba(0,0,0,0.8)",
      },
      backgroundColor: {
        brand: "var(--figma-color-bg-brand)",
      },
      textColor: {
        secondary: "var(--figma-color-text-secondary)",
        "icon-onbrand": "var(--figma-color-icon-onbrand)",
      },
      borderColor: {
        divider: "var(--figma-color-border)",
        brand: "var(--figma-color-bg-brand)",
        disabled: "rgba(0,0,0,0.2)",
      },
    },
  },
  plugins: [],
};
