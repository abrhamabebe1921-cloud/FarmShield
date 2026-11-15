/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Phase 4.4 Professional Agricultural Dark Identity
        forest: {
          DEFAULT: '#132A20',    // Secondary agricultural deep green
          50: '#F4F7F4',
          100: '#E5EBDD',
          200: '#DCE8D8',
          300: '#A9C4A6',
          400: '#8EB897',        // Natural bright green
          500: '#487146',
          600: '#345E40',
          700: '#244C3A',        // Standard forest
          800: '#1C3C2E',
          900: '#132A20',        // Deep secondary
          950: '#0C1B14',        // Deep primary background
        },
        agri: {
          bg: '#0C1B14',         // Primary deep background
          surface: '#132A20',    // Secondary background
          card: 'rgba(19, 42, 32, 0.75)', // Translucent card surface
          border: 'rgba(142, 184, 151, 0.2)', // Subtle natural border
          borderLight: 'rgba(142, 184, 151, 0.4)',
          text: '#F8F9FA',       // White primary text
          muted: '#A0AEC0',      // Soft gray for readability
          bright: '#2ECC71',     // Vibrant biological green
          gold: '#F1C40F',       // Warm agricultural gold
          orange: '#E46B31',     // Terracotta accent
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'natural-xs': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
        'natural-sm': '0 2px 6px -1px rgba(0, 0, 0, 0.25)',
        'natural': '0 4px 12px -2px rgba(0, 0, 0, 0.3)',
        'natural-lg': '0 10px 24px -4px rgba(0, 0, 0, 0.45)',
        'agri-glow': '0 0 20px -5px rgba(46, 204, 113, 0.25)',
      },
    },
  },
  plugins: [],
}
