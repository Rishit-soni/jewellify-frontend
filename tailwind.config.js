/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
        },
        surface: {
          0: 'var(--surface-0)',
          50: 'var(--surface-50)',
          100: 'var(--surface-100)',
          200: 'var(--surface-200)',
          300: 'var(--surface-300)',
          400: 'var(--surface-400)',
          500: 'var(--surface-500)',
          600: 'var(--surface-600)',
          700: 'var(--surface-700)',
          800: 'var(--surface-800)',
          900: 'var(--surface-900)',
        },
        card: 'var(--card-bg)',
        main: 'var(--text-main)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        border: 'var(--border-color)',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  }
}
