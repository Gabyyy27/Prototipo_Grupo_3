/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#0052cc',
          deep: '#003d9b',
          secondary: '#00b8d9',
          success: '#36b37e',
        },
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.05)',
        modal: '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
