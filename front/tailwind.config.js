/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        toss: {
          blue: '#3182F6'
        }
      },
      boxShadow: {
        soft: '0 18px 40px rgba(25, 31, 40, 0.08)'
      }
    }
  },
  plugins: []
};
