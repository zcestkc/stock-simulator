import type { Config } from 'tailwindcss';

// Maps a CSS token from src/styles/globals.css to a Tailwind colour that supports `/opacity`.
const token = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

/*
 * Tokens are scoped by role, so the wrong pairing doesn't compile:
 * `bg-card` exists but `text-card` doesn't; `text-muted-foreground` exists but
 * `bg-muted-foreground` doesn't. See CLAUDE.md. Tokens used only from JS
 * (chart-*) aren't exposed here — read them with tokenColor().
 */

// Status colours may be used as text, borders, or tinted backgrounds (`bg-positive/10`).
const status = {
  positive: token('positive'),
  negative: token('negative'),
  destructive: token('destructive'),
  info: token('info'),
  warning: token('warning'),
};

// Surfaces: bg-*, ring-offset-*
const surfaces = {
  background: token('background'),
  card: token('card'),
  popover: token('popover'),
  primary: token('primary'),
  secondary: token('secondary'),
  muted: token('muted'),
  accent: token('accent'),
  overlay: token('overlay'),
  sidebar: {
    DEFAULT: token('sidebar'),
    accent: token('sidebar-accent'),
    active: token('sidebar-active'),
  },
};

// Foregrounds: text on top of a surface — text-*
const foregrounds = {
  foreground: token('foreground'),
  'card-foreground': token('card-foreground'),
  'popover-foreground': token('popover-foreground'),
  'primary-foreground': token('primary-foreground'),
  'secondary-foreground': token('secondary-foreground'),
  'muted-foreground': token('muted-foreground'),
  'accent-foreground': token('accent-foreground'),
  'destructive-foreground': token('destructive-foreground'),
  link: token('link'),
  sidebar: {
    foreground: token('sidebar-foreground'),
    muted: token('sidebar-muted'),
    'active-foreground': token('sidebar-active-foreground'),
  },
};

// Lines: border-*, divide-*, ring-*
const lines = {
  border: token('border'),
  input: token('input'),
  ring: token('ring'),
};

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: { ...surfaces, ...status },
      ringOffsetColor: surfaces,
      textColor: { ...foregrounds, ...status },
      borderColor: { ...lines, ...status }, // divide-* reads borderColor
      ringColor: { ...lines, ...status },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
