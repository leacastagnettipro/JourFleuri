/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'jour-fleuri': {
          cream: '#fff4ea',
          'rose-pale': '#ffd3d3',
          'jaune-pale': '#ffe7c6',
          'rose-poudre-pale': '#ffeef2',
          coral: '#ed3f23',
          'coral-clair': '#ff6d64',
          jaune: '#ffa301',
          'rose-poudre': '#ffc9d1',
        },
      },
      fontFamily: {
        serif: ['Tangerine', 'cursive'],
        sans: ['Montserrat', 'sans-serif'],
        script: ['Italiana', 'serif'],
      },
    },
  },
  plugins: [],
};
