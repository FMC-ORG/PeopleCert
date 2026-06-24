/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}', './app/**/*.{js,jsx}', './src/**/*.{js,jsx}'],
  prefix: '',
  theme: {
    fontFamily: {
      sans: ['"Inter"', '"Lato"', 'system-ui', 'sans-serif'],
      display: ['"Inter"', '"Lato"', 'system-ui', 'sans-serif'],
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        peoplecert: {
          orange: {
            DEFAULT: '#E35D3A',
            50: '#FDF1ED',
            100: '#FBDDD2',
            200: '#F6B9A5',
            300: '#F09379',
            400: '#EA764F',
            500: '#E35D3A',
            600: '#BE4525',
            700: '#8E331B',
            800: '#5E2212',
            900: '#2F1109',
          },
          navy: {
            DEFAULT: '#0F1B2D',
            50: '#E7E9ED',
            100: '#C7CDD5',
            200: '#8F96A6',
            300: '#59647A',
            400: '#2B3852',
            500: '#0F1B2D',
            600: '#0B1322',
            700: '#080E19',
            800: '#050912',
            900: '#02040A',
          },
          ink: '#15202B',
          paper: '#FFFFFF',
          muted: '#6B7280',
          surface: '#F7F8FA',
          border: '#E5E7EB',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 27, 45, 0.06), 0 2px 8px rgba(15, 27, 45, 0.06)',
        'card-lg': '0 4px 12px rgba(15, 27, 45, 0.08), 0 12px 32px rgba(15, 27, 45, 0.08)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
