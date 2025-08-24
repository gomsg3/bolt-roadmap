/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '90rem',
      },
      colors: {
        gray: {
          150: '#f1f5f9',
        }
      },
      borderWidth: {
        '3': '3px',
      },
      scale: {
        '102': '1.02',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
