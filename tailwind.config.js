/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tenant: {
          primary: {
            DEFAULT: 'var(--color-primary, #047857)',
            50: 'var(--color-primary-50, #f0fdf4)',
            100: 'var(--color-primary-100, #dcfce7)',
            500: 'var(--color-primary-500, #10b981)',
            600: 'var(--color-primary-600, #059669)',
            700: 'var(--color-primary-700, #047857)',
            900: 'var(--color-primary-900, #064e3b)',
          },
          secondary: {
            DEFAULT: 'var(--color-secondary, #d97706)',
            50: 'var(--color-secondary-50, #fffbeb)',
            100: 'var(--color-secondary-100, #fef3c7)',
            500: 'var(--color-secondary-500, #f59e0b)',
            600: 'var(--color-secondary-600, #d97706)',
            700: 'var(--color-secondary-700, #b45309)',
          },
          accent: 'var(--color-accent, #0284c7)',
          background: 'var(--color-bg, #f8fafc)',
          surface: 'var(--color-surface, #ffffff)',
          text: 'var(--color-text, #0f172a)',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'var(--font-poppins)', 'Inter', 'sans-serif'],
        display: ['var(--font-dm-sans)', 'Poppins', 'sans-serif'],
        dm: ['var(--font-dm-sans)', 'sans-serif'],
        poppins: ['Poppins', 'var(--font-poppins)', 'sans-serif'],
        arabic: ['"Amiri"', '"Scheherazade New"', '"Noto Naskh Arabic"', 'serif'],
        uthmani: ['"KFGQPC Uthman Taha Naskh"', '"Amiri"', 'serif'],
      },
      borderRadius: {
        DEFAULT: '0.375rem', // rounded-md default
        tenant: 'var(--tenant-radius, 0.375rem)',
      },
    },
  },
  plugins: [],
};
