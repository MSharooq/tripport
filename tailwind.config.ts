import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue'
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#00241a',
          900: '#0d3b2e',
          700: '#234e40',
          500: '#3c6658',
          300: '#79a694',
          100: '#beedd9'
        },
        mist: {
          50: '#f8f9f9',
          100: '#f3f4f4',
          200: '#e7e8e8',
          300: '#d9dada',
          500: '#717974',
          700: '#414845',
          950: '#191c1c'
        },
        sage: {
          100: '#c5ebdc',
          300: '#a9cfc0',
          600: '#43655a'
        }
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Manrope', 'sans-serif']
      },
      boxShadow: {
        mist: '0 24px 80px rgba(0, 36, 26, 0.08)',
        soft: '0 16px 48px rgba(0, 36, 26, 0.06)'
      }
    }
  }
} satisfies Config
