/* eslint-disable prettier/prettier */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["poppins"],
        "poppins-bold": ["poppins-bold"],
        "poppins-semibold": ["poppins-semibold"],
        "poppins-light": ["poppins-light"],
        "poppins-medium": ["poppins-medium"],
        excon: ["Excon_Complete"],
        Ranade: ["Ranade_Complete"],
      },
    },
  },
  plugins: [],
};
