/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',                            // <-- penting agar dark mode global
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'del-blue': '#1D4ED8',
        'del-gray': '#F3F4F6',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
