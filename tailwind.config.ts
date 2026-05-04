import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef0fc',
          100: '#d5d9f7',
          200: '#aab2f0',
          500: '#3d4fd6',
          600: '#2d3eb8',
          700: '#1e2e9e',
          DEFAULT: '#0D1B8E',
          900: '#091466',
        },
      },
    },
  },
  plugins: [],
}

export default config
