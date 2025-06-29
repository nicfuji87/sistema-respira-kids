/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores oficiais da marca Respira KIDS
        'respira': {
          50: '#f0fdfb',
          100: '#d9f9f4',
          200: '#b8f2ea',
          300: '#92D3C7',  // Azul principal da marca
          400: '#6bc2b5',
          500: '#4aa399',
          600: '#35847c',
          700: '#2a6b65',
          800: '#235651',
          900: '#1e4944',
        },
        'kids': {
          50: '#fef7f6',
          100: '#fdeeed',
          200: '#fbd5d1',
          300: '#F39D94',  // Vermelho principal da marca
          400: '#ed6b5f',
          500: '#e33f2b',
          600: '#d42817',
          700: '#b01e0f',
          800: '#921b10',
          900: '#7a1a13',
        },
        'brand': {
          'bege': '#FDF0DE',     // Bege da marca
          'roxo': '#4E1963',     // Roxo da marca
          'amarelo': '#FDCD1F',  // Amarelo da marca
          'verde': '#C6E09F',    // Verde da marca
          'cinza': '#7A7A7A',    // Cinza da marca
          'branco': '#FFFFFF',   // Branco da marca
        },
        // Variações do roxo para diferentes usos
        'purple-brand': {
          50: '#faf7fc',
          100: '#f3ecf7',
          200: '#e6d9ee',
          300: '#d4bee0',
          400: '#bd9bcf',
          500: '#a474bb',
          600: '#8a57a3',
          700: '#744889',
          800: '#623d70',
          900: '#4E1963',  // Roxo principal
        },
        // Variações do bege para fundos
        'beige-brand': {
          50: '#FDF0DE',   // Bege principal
          100: '#fbe9c7',
          200: '#f7d791',
          300: '#f2c564',
          400: '#edb642',
          500: '#e5a524',
          600: '#d18e1a',
          700: '#ad7316',
          800: '#8a5a18',
          900: '#6f4817',
        }
      },
      fontFamily: {
        'respira': ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'respira': '0 4px 20px -2px rgba(146, 211, 199, 0.25)',     // Azul da marca
        'kids': '0 4px 20px -2px rgba(243, 157, 148, 0.25)',        // Vermelho da marca
        'brand-purple': '0 4px 20px -2px rgba(78, 25, 99, 0.15)',   // Roxo da marca
        'brand-yellow': '0 4px 20px -2px rgba(253, 205, 31, 0.20)', // Amarelo da marca
      }
    },
  },
  plugins: [],
}
