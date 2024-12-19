import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  fontFamily: {
    mono: ['"Geist Mono"', ...defaultTheme.fontFamily.mono],
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
