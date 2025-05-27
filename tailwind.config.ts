import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'Content-Secondary': '#272f3a',
        'Content-Default': '#01171e',
        'Content-Tertiary': '#9CA3AF',
        'Border-Default': '#E5E7EB',
        'Border-Divider': '#E5E7EB',
        'Color-Modes-White': '#FFFFFF',
        'cyan-700': '#0891B2',
        'A6C9D7': '#A6C9D7',
        'Neutral-100': '#F5F6FA',
        'Neutral-50': '#FAFBFC',
        'Neutral-200': '#E5E7EB',
        'Navy-400': '#2C3A4B',
'Navy-600': '#055c76',
        'Background-Accent-Web-Default': '#3B82F6', 
        'Background-Accent-Web-Dark': '#2563EB', 
        'Color-Text-Colors-Muted-Text': '#6B7280', 
        'Color-Text-Colors-Default': '#171717',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} as Config;
