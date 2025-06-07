// tailwind.config.ts
/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate'

module.exports = {
  darkMode: ['class'],
  content: [
    // Asigură-te că aceste căi acoperă toate fișierele tale unde folosești clase Tailwind CSS
    './src/pages/**/*.{ts,tsx,js,jsx,mdx}', // <-- Adaugă 'src/'
    './src/components/**/*.{ts,tsx,js,jsx,mdx}', // <-- Adaugă 'src/'
    './src/app/**/*.{ts,tsx,js,jsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
