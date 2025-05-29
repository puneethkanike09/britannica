/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Mulish", "ui-sans-serif", "system-ui", "sans-serif"],

      mulish: ["Mulish", "sans-serif"],
    },
    extend: {
      fontWeight: {
        normal: 400,
        medium: 500,
        bold: 700,
        black: 900,
      },
    },
  },
  plugins: [],
};
