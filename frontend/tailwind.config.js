/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        }
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'waveform': 'waveform 1s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.7,
          },
        },
        'waveform': {
          '0%': {
            transform: 'scaleY(0.1)',
          },
          '100%': {
            transform: 'scaleY(1)',
          },
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};