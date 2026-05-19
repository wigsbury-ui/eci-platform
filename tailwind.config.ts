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
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        jost: ['var(--font-jost)', 'system-ui', 'sans-serif'],
      },
      colors: {
        eci: {
          purple: '#4C2585',
          'purple-dark': '#2D1654',
          'purple-mid': '#6B3DA8',
          'purple-light': '#EDE5F7',
          gold: '#C8A84B',
          'gold-light': '#F0E4B0',
          cream: '#F8F4EF',
          dark: '#1A1228',
        },
      },
    },
  },
  plugins: [],
}
export default config
