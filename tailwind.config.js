/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
  ],
  theme: {
    extend: {
      colors: {
        camherdarkyellow: '#FF9C20',
        camherlightyellow: '#FFBE62',
        camhergreen: '#ADEA8C',
        camherred: '#FF4D4D',
      },
    },
  },
  plugins: [],
};
