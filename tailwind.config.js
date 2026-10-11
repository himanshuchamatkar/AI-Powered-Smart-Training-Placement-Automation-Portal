/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcdbff',
          300: '#8ec4ff',
          400: '#58a2ff',
          500: '#307eff',
          600: '#195ff5',
          700: '#1349e1',
          800: '#163bb6',
          900: '#17368f',
          950: '#122257',
        },
        navy: {
          800: '#0f172a',
          900: '#090d16',
          950: '#04070e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
