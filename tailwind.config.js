/** @type {import('tailwindcss').Config} */
module.exports = {
 content: [`./views/**/*.ejs`], // all .html files
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['cupcake'],
  },
}

