/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // New Blue/White/Gold Theme
        primary: {
          50: '#e6f3ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#007FFF', // Main blue
          600: '#005C96', // Darker blue
          700: '#004a7a',
          800: '#003d5e',
          900: '#002f42',
        },
        gold: {
          50: '#fffcf0',
          100: '#fef7d6',
          200: '#fdeaa7',
          300: '#fcdc78',
          400: '#fbce49',
          500: '#F0C300', // Main gold
          600: '#A98307', // Darker gold
          700: '#876906',
          800: '#654f05',
          900: '#433403',
        },
        white: '#FFFFFF',
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Legacy colors for backward compatibility
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
        'bounce-slow': 'bounce 3s linear infinite',
        'fade-in': 'fade-in 0.5s ease-in-out',
        'slide-in': 'slide-in 0.3s ease-out',
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
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-in': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'modern': '0 4px 25px -5px rgba(0, 92, 150, 0.1), 0 10px 10px -5px rgba(0, 92, 150, 0.04)',
        'gold': '0 4px 25px -5px rgba(240, 195, 0, 0.2), 0 10px 10px -5px rgba(240, 195, 0, 0.1)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
};