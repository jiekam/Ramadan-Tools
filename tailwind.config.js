/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a1710',
        'bg-secondary': '#12261b',
        'bg-card': '#163124',
        'accent-gold': '#e8b945', /* Brighter gold */
        'accent-gold-dark': '#b99026',
        'text-primary': '#f0eedc',
        'text-secondary': '#b0b8ac',
        'success': '#34d399',
        'warning': '#fbbf24',
        'danger': '#ef4444',
      },
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Inter', 'Lato', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 15px 0 rgba(232, 185, 69, 0.3)',
      }
    },
  },
  plugins: [],
}

