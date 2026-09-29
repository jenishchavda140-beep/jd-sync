/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf7',
          100: '#d4f7eb',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d'
        },
        accent: {
          500: '#7c3aed'
        }
      },
      boxShadow: {
        glow: '0 10px 30px rgba(52, 211, 153, 0.35)'
      }
    }
  },
  plugins: []
};
