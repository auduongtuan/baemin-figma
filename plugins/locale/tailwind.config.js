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
      data: {
        open: 'state="open"',
        checked: 'state="checked"',
        indeterminate: 'state="indeterminate"',
      },
      spacing: spacingScale,
      fontSize: {
        xsmall: "11px",
        small: "12px",
        large: "13px",
        xlarge: "14px",
      },
      colors: {
        action: "rgba(0,0,0,0.8)",
        secondary: "var(--figma-color-text-secondary)",
        danger: "var(--figma-color-text-danger)",
        brand: "var(--figma-color-bg-brand)",
        component: "var(--figma-color-bg-component)",
      },
      backgroundColor: {
        hover: "var(--figma-color-bg-hover)",
      },
      textColor: {
        "icon-onbrand": "var(--figma-color-icon-onbrand)",
      },
      borderColor: {
        divider: "var(--figma-color-border)",
        disabled: "rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
