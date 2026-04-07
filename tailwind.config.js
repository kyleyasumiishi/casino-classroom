/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        felt: {
          DEFAULT: '#1a472a',
          light: '#225c38',
          dark: '#0f2d1a',
        },
        cream: {
          DEFAULT: '#f5f0e8',
          dark: '#e8dfd3',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#d4b96a',
          dark: '#b08f3a',
        },
        casino: {
          red: '#b91c1c',
          blue: '#1e3a5f',
          black: '#1a1a1a',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
