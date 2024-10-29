// tailwind.config.js
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#050c9c",
        secondary: "#3572ef",
        foreground: "#000000",
        accent: "#a7e6ff",
        "background-pattern": "#050c9c",
        "card-background": "#050c9c",
        "card-text": "#e4e4e4",
        "bg-modal-background": "#050c9c",
        "divider": "#3572ef",
      },
      borderRadius: {
        small: "2px",
        medium: "4px",
        large: "6px",
        xl: "10px",
      },
      borderWidth: {
        small: "1px",
        medium: "1px",
        large: "2px",
      },
      backgroundImage: {
        pattern: "url('/path/to/pattern-image.png')",
      },
      fontSize: {
        base: "16px",
        lg: "18px",
        xl: "24px",
        "2xl": "32px",
      },
    },
  },
  plugins: [
    nextui({
      layout: {
        disabledOpacity: "0.3",
        radius: {
          small: "2px",
          medium: "4px",
          large: "6px",
        },
        borderWidth: {
          small: "1px",
          medium: "1px",
          large: "2px",
        },
      },
      themes: {
        light: {},
        dark: {
          colors: {
            primary: "#BEF264",
            focus: "#BEF264",
            foreground: "#000000",
          },
        },
      },
    }),
  ],
};
