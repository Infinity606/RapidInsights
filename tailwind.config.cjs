/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        exter: ['Exter Ultra Bold', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

