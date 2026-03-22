/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Outfit', 'sans-serif'],
      },
      colors: {
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        aurum: {
          black:  '#0a0a0a',
          dark:   '#111111',
          card:   '#161616',
          border: '#2a2a2a',
          muted:  '#3a3a3a',
          text:   '#e8e0cc',
          gold:   '#f0c040',
          glow:   '#ffd700',
        }
      },
      boxShadow: {
        gold:      '0 0 20px rgba(240,192,64,0.3)',
        'gold-lg': '0 0 40px rgba(240,192,64,0.4)',
        'gold-sm': '0 0 8px rgba(240,192,64,0.2)',
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'fade-in':    'fadeIn 0.6s ease forwards',
        'slide-up':   'slideUp 0.5s ease forwards',
      },
      keyframes: {
        glowPulse: {
          '0%,100%': { textShadow: '0 0 10px rgba(240,192,64,0.5)' },
          '50%':     { textShadow: '0 0 30px rgba(240,192,64,0.9), 0 0 60px rgba(240,192,64,0.4)' },
        },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        aurumvault: {
          primary:    '#f0c040',
          secondary:  '#b45309',
          accent:     '#ffd700',
          neutral:    '#161616',
          'base-100': '#0a0a0a',
          'base-200': '#111111',
          'base-300': '#161616',
          info:       '#3abff8',
          success:    '#36d399',
          warning:    '#fbbd23',
          error:      '#f87272',
        },
      },
    ],
  },
}
