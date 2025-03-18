/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00',
          50: '#FFF1E5',
          100: '#FFE4CC',
          200: '#FFCA99',
          300: '#FFB066',
          400: '#FF9633',
          500: '#FF6B00',
          600: '#CC5500',
          700: '#994000',
          800: '#662A00',
          900: '#331500',
        },
      },
    },
  },
  plugins: [],
};