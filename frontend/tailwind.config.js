/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neub: {
          primary: '#D9FF00',
          secondary: '#B39DDB',
          accent: '#FFB74D',
          bg: '#F5F5F5',
          text: '#000000',
          border: '#000000',
        },
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-active': '1px 1px 0px 0px rgba(0,0,0,1)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
