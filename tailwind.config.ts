import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Remapped from navy to near-black — existing classes keep working
        navy: {
          950: '#080808',
          900: '#0d0d0d',
          800: '#141414',
          700: '#1e1e1e',
        },
        // Purple remapped to white/gray — primary buttons become white
        purple: {
          DEFAULT: '#ffffff',
          light: '#cccccc',
          dark: '#aaaaaa',
          glow: 'rgba(255,255,255,0.08)',
        },
        'slate-text': '#666666',
        'slate-light': '#999999',
        'green-accent': '#22c55e',
        // New semantic tokens for Cuberto aesthetic
        ink: {
          DEFAULT: '#0d0d0d',
          soft: '#111111',
          card: '#161616',
          line: '#1e1e1e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '480px',
      },
      fontSize: {
        // Cuberto-scale: massive display, tight tracking
        display: ['clamp(4rem, 12vw, 10rem)', { lineHeight: '0.88', letterSpacing: '-0.05em' }],
        hero: ['clamp(3.2rem, 9vw, 8rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        section: ['clamp(2.4rem, 5vw, 4.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        marquee: 'marquee 45s linear infinite',
        'marquee-slow': 'marquee 70s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        shimmer: 'gradient-shift 4s ease infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'pulse-glow': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
