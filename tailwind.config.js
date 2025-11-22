/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1a3a6e',
        'brand-blue-light': '#2a5a9e',
        'brand-yellow': '#ffc107',
        'brand-gray': '#f3f4f6',
      },
    },
  },
  plugins: [],
}
