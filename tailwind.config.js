/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        abismo: '#04101F',
        profundo: '#071B33',
        corrente: '#0E2A4A',
        hidro: '#1E6BFF',
        eletrico: '#4D9BFF',
        espuma: '#9EDCF7',
        vazamento: '#FF6B84',
        atencao: '#FFC46B'
      },
      fontFamily: {
        marca: ['"Playfair Display"', 'Georgia', 'serif'],
        interface: ['"IBM Plex Sans"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        agua: '0 0 60px -12px rgba(30,107,255,0.55)'
      }
    }
  },
  plugins: []
}
