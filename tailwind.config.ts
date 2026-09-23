import type { Config } from 'tailwindcss';

// Maps a CSS token from src/styles/globals.css to a Tailwind colour that supports `/opacity`.
const token = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: token('background'),
        foreground: token('foreground'),
        card: {
          DEFAULT: token('card'),
          foreground: token('card-foreground'),
        },
        popover: {
          DEFAULT: token('popover'),
          foreground: token('popover-foreground'),
        },
        primary: {
          DEFAULT: token('primary'),
          foreground: token('primary-foreground'),
        },
        secondary: {
          DEFAULT: token('secondary'),
          foreground: token('secondary-foreground'),
        },
        muted: {
          DEFAULT: token('muted'),
          foreground: token('muted-foreground'),
        },
        accent: {
          DEFAULT: token('accent'),
          foreground: token('accent-foreground'),
        },
        destructive: {
          DEFAULT: token('destructive'),
          foreground: token('destructive-foreground'),
        },
        positive: token('positive'),
        negative: token('negative'),
        info: token('info'),
        warning: token('warning'),
        link: token('link'),
        border: token('border'),
        input: token('input'),
        ring: token('ring'),
        overlay: token('overlay'),
        sidebar: {
          DEFAULT: token('sidebar'),
          foreground: token('sidebar-foreground'),
          muted: token('sidebar-muted'),
          accent: token('sidebar-accent'),
          active: token('sidebar-active'),
          'active-foreground': token('sidebar-active-foreground'),
        },
        chart: {
          grid: token('chart-grid'),
          1: token('chart-1'),
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
