/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      fontFamily:{
        'Roboto':['Roboto', 'sans-serif'],
        'Poppins':['Poppins','sans-serif'],
      },
    },
  },
  plugins: [],
}