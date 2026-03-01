/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',      // Золотой
        milk: '#FFF8F0',      // Молочный
        graphite: '#3A3A3A',  // Графитовый
      },
    },
  },
  plugins: [],
};
