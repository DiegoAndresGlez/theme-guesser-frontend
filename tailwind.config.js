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
      fontFamily: {
        sans: ["'Nunito Sans', sans-serif"],
        heading: ["'Whatdo', sans-serif"],
      },
      fontSize: {
        h1: "80px",
        h2: "32px",
        base: "16px",
        lg: "18px",
        xl: "24px",
        "2xl": "32px",
      },
      colors: {
        primary: {
          50: '#e6e7f5',
          100: '#cdcfeb',
          200: '#9a9fd7',
          300: '#686fc3',
          400: '#363faf',
          500: '#050c9c', // your base primary color
          600: '#040a7d',
          700: '#03075e',
          800: '#02053e',
          900: '#01021f',
          DEFAULT: '#050c9c', // this ensures `primary` still works without a scale
        },
        secondary: {
          50: '#eaf2fe',
          100: '#d5e5fd',
          200: '#abcbfb',
          300: '#82b1f9',
          400: '#5897f7',
          500: '#3572ef', // your base secondary color
          600: '#2a5bbf',
          700: '#20448f',
          800: '#152d5f',
          900: '#0b1630',
          DEFAULT: '#3572ef',
        },
        danger: {
          50: '#fdf2f7',
          100: '#fce7f2',
          200: '#fecdd7',
          300: '#fda4bd',
          400: '#fb7aa2',
          500: '#f43f7a',
          600: '#e11d5f',
          700: '#be0f4b',
          800: '#9c0550', // base danger
          900: '#83044c',
          DEFAULT: '#e11d5f',
        },
        accent: {
          50: '#f5fcff',
          100: '#ebf9ff',
          200: '#d7f3ff',
          300: '#c3edff',
          400: '#afe7ff',
          500: '#a7e6ff', // your base accent color
          600: '#86b8cc',
          700: '#648a99',
          800: '#435c66',
          900: '#212e33',
          DEFAULT: '#a7e6ff',
        },
        'card-background': {
          50: '#e6e7f5',
          100: '#cdcfeb',
          200: '#9a9fd7',
          300: '#686fc3',
          400: '#363faf',
          500: '#050c9c', // your base card-background color
          600: '#040a7d',
          700: '#03075e',
          800: '#02053e',
          900: '#01021f',
          DEFAULT: '#050c9c',
        },
        divider: {
          50: '#eaf2fe',
          100: '#d5e5fd',
          200: '#abcbfb',
          300: '#82b1f9',
          400: '#5897f7',
          500: '#3572ef', // your base divider color
          600: '#2a5bbf',
          700: '#20448f',
          800: '#152d5f',
          900: '#0b1630',
          DEFAULT: '#3572ef',
        },
        headingColor: {
          DEFAULT: '#a7e6ff'
        }
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
      // backgroundImage: {
      //   pattern: "url('/path/to/pattern-image.png')",
      // },
      
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
        dark: {
          colors: {
            focus: "#86b8cc"
          },
        },
      },
    }),
  ],
};
