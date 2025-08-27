import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { brandAccent:'#E63946', brandPrimary:'#1D3557', brandBg:'#F1FAEE' },
      fontFamily: { sans:['Inter','ui-sans-serif','system-ui'] }
    }
  },
  plugins: []
} satisfies Config
