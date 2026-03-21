/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8b6d4b',
          dark: '#6d5639',
          light: '#a88b6a'
        },
        secondary: '#696969',
        background: {
          DEFAULT: '#fafafa',
          dark: '#f7f7f7'
        }
      },
      fontFamily: {
        serif: ['DM Serif Display', 'serif'],
        sans: ['Libre Franklin', 'sans-serif']
      }
    }
  },
  plugins: []
}
