/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Tight', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        title: ['Alte Haas Grotesk', 'Inter Tight', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#1783e4',
          deep: '#025ba4',
          secondary: '#57cc99',
          success: '#57cc99',
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
