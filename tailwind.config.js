/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: '#171717',
        muted: '#66645f',
        rule: '#d9d3c8',
        paper: '#fbfaf7',
        panel: '#f3f0ea',
        oxblood: '#8b1a1a',
        gold: '#b98722',
        steel: '#213f63',
        teal: '#1e5c52',
      },
    },
  },
  plugins: [],
}
