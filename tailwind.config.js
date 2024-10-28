// tailwind.config.js
import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export const content = [
  // ...
  // make sure it's pointing to the ROOT node_module
  "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    colors: {
      'primary': '#050c9c',
      'secondary': '#1d4cac',
  }},
}
 
export const darkMode = "class";
export const plugins = [nextui()];

