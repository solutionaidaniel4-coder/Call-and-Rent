/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        windsurf: {
          50: '#f0fdfc',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#2ee5b5',
          600: '#36C7A3',
          700: '#2ba584',
          800: '#238470',
          900: '#1e6b5c',
        },
        charcoal: {
          50: '#f7f7f7',
          100: '#e8e8e8',
          200: '#d4d4d4',
          300: '#b8b8b8',
          400: '#9a9a9a',
          500: '#7c7c7c',
          600: '#636363',
          700: '#4d4d4d',
          800: '#383838',
          900: '#1A1A1A',
        },
        cream: '#e0d4ad',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
