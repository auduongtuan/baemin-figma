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
      keyframes: {
        shine: {
          "100%": {
            "background-position-x": "-200%",
          },
        },
      },
      data: {
        open: 'state="open"',
        checked: 'state="checked"',
        indeterminate: 'state="indeterminate"',
      },
      letterSpacing: {
        tight: "-0.01em",
      },
      boxShadow: {
        hud: "var(--shadow-hud)",
        modal:
          "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
      },
      spacing: spacingScale,
      fontSize: {
        xsmall: "11px",
        small: "12px",
        large: "13px",
        xlarge: "14px",
      },
      colors: {
        disabled: "rgba(0,0,0,0.3)",
        action: "rgba(0,0,0,0.8)",
        secondary: "var(--figma-color-text-secondary)",
        tertiary: "var(--figma-color-text-tertiary)",
        danger: "var(--figma-color-text-danger)",
        brand: "var(--figma-color-bg-brand)",
        brandStrong: "var(--figma-color-bg-brand-strong)",
        brandHover: "var(--figma-color-bg-brand-hover)",
        brandPressed: "var(--figma-color-bg-brand-pressed)",
        component: "var(--figma-color-bg-component)",
        onbrand: "var(--figma-color-text-onbrand)",
        onbrandSecondary: "var(--figma-color-text-onbrand-secondary)",
        oncomponentTeritary: "var(--figma-color-text-oncomponent-tertiary)",
      },
      backgroundImage: {
        skeleton:
          "linear-gradient( 110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%)",
      },
      backgroundColor: {
        default: "var(--figma-color-bg)",
        hover: "var(--figma-color-bg-hover)",
        hud: "var(--hud)",
        selection: "rgba(24, 145, 251, 0.3)",
      },
      textColor: {
        "icon-onbrand": "var(--figma-color-icon-onbrand)",
      },
      borderColor: {
        divider: "var(--figma-color-border)",
        disabled: "rgba(0,0,0,0.1)",
        light: "rgba(0,0,0,0.1)",
        focus: "rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};
