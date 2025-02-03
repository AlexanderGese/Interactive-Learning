/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#1a1a1a',
          lighter: '#2a2a2a'
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class'
};