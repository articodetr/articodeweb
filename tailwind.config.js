/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#08090b',
          900: '#0c0e11',
          850: '#0f1216',
          800: '#14181d',
          750: '#191e24',
          700: '#1f262e',
          600: '#2a323c',
          500: '#3a4452',
          400: '#5a6678',
          300: '#828c9c',
          200: '#aab2bf',
          100: '#ccd1da',
          50: '#e6e9ef',
        },
        accent: {
          50: '#eef2ff',
          100: '#dce3ff',
          200: '#bcc8ff',
          300: '#91a2ff',
          400: '#586dff',
          500: '#354be8',
          600: '#2939c7',
          700: '#2432a2',
          800: '#232e83',
          900: '#222b6b',
        },
        cyan: {
          50: '#e9fcff',
          100: '#c9f7fc',
          200: '#98edf5',
          300: '#58dbe9',
          400: '#16c2da',
          500: '#08a9c8',
          600: '#0787a6',
          700: '#0b6d87',
          800: '#10586e',
          900: '#12495c',
          glow: '#16c2da',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fadeIn 0.7s ease forwards',
        'slide-in': 'slideIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'spin-slow': 'spin 24s linear infinite',
        'spin-slow-rev': 'spinReverse 30s linear infinite',
        shimmer: 'shimmer 3s linear infinite',
        'grid-pulse': 'gridPulse 8s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        'pulse-ring': 'pulseRing 3s ease-out infinite',
        'gradient-x': 'gradientX 6s ease infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gridPulse: {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '0.5' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        brand: 'linear-gradient(135deg, #2939e8 0%, #354be8 42%, #16c2da 100%)',
        'brand-soft': 'linear-gradient(135deg, rgba(53,75,232,0.18), rgba(22,194,218,0.12))',
        'grid-faint':
          'linear-gradient(to right, rgba(15,23,42,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.055) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-md': '48px 48px',
      },
    },
  },
  plugins: [],
};
