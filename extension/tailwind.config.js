/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/popup/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'Inter',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        // Apple-inspired neutral system palette.
        ink: {
          50: '#f5f5f7',
          100: '#e8e8ed',
          200: '#d2d2d7',
          300: '#aeaeb2',
          400: '#86868b',
          500: '#6e6e73',
          600: '#48484a',
          700: '#2c2c2e',
          800: '#1c1c1e',
          900: '#0a0a0c',
        },
        accent: {
          DEFAULT: '#0a84ff',
          hover: '#0070e0',
        },
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.12)',
        card: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out both',
        'scale-in': 'scale-in 0.2s ease-out both',
      },
    },
  },
  plugins: [],
};
