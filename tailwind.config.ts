import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fdfbf7',
          100: '#faf6ee',
          200: '#f4ebd8',
          300: '#eddcb9',
          400: '#e3c690',
          500: '#d8b06c',
        },
        scrapbook: {
          kraft: '#d8c29d',
          tape: 'rgba(255, 243, 205, 0.75)',
          tapePink: 'rgba(254, 215, 226, 0.75)',
          tapeMint: 'rgba(209, 250, 229, 0.75)',
          tapeGold: 'rgba(254, 240, 138, 0.75)',
          tapeLavender: 'rgba(233, 213, 255, 0.75)',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        handwritten: ['var(--font-caveat)', 'cursive'],
        serif: ['var(--font-playfair)', 'serif'],
        script: ['var(--font-dancing)', 'cursive'],
      },
      boxShadow: {
        'polaroid': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.03)',
        'polaroid-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05)',
        'letter': '0 10px 30px -5px rgba(90, 60, 30, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'subtle-pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(var(--tw-rotate, 0deg))' },
          '50%': { transform: 'translateY(-6px) rotate(var(--tw-rotate, 0deg))' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
