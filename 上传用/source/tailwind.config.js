/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#08090d',
          900: '#0b0d12',
          850: '#11141c',
          800: '#171b26',
        },
        accent: {
          violet: '#7c6cff',
          teal: '#38d9c4',
          amber: '#ffb86c',
        },
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(124,108,255,0.55)',
        'glow-teal': '0 0 40px -10px rgba(56,217,196,0.5)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-24px) translateX(10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.25' },
        },
      },
      animation: {
        float: 'float 14s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        blink: 'blink 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
