import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'fire': 'fire 1.5s infinite alternate'
      },
        keyframes: {
          fire: {
            '0%, 100%': { 
              textShadow: '0 0 10px #ff9900, 0 0 20px #ff6600, 0 0 30px #ff4400',
              color: '#ffcc00'
            },
            '50%': { 
              textShadow: '0 0 15px #ff6600, 0 0 25px #ff4400, 0 0 35px #ff2200',
              color: '#ff9900'
            }
          }
        }
    },
  },
  plugins: [],
} satisfies Config;