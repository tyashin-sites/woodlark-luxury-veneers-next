import type { Config } from 'tailwindcss';

/**
 * Woodlark design tokens. CSS vars in globals.css hold RAW oklch triples
 * (e.g. `--cream: 0.965 0.012 80`). Wrapping with `oklch(... / <alpha-value>)`
 * here is what makes utilities like `text-cream/90` and `bg-walnut-deep/80`
 * produce valid CSS in Tailwind v3.
 */
const oklchVar = (name: string) => `oklch(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    container: { center: true, padding: '1.25rem', screens: { '2xl': '1440px' } },
    extend: {
      colors: {
        background: oklchVar('--background'),
        foreground: oklchVar('--foreground'),
        card: { DEFAULT: oklchVar('--card'), foreground: oklchVar('--card-foreground') },
        popover: { DEFAULT: oklchVar('--popover'), foreground: oklchVar('--popover-foreground') },
        primary: { DEFAULT: oklchVar('--primary'), foreground: oklchVar('--primary-foreground') },
        secondary: { DEFAULT: oklchVar('--secondary'), foreground: oklchVar('--secondary-foreground') },
        muted: { DEFAULT: oklchVar('--muted'), foreground: oklchVar('--muted-foreground') },
        accent: { DEFAULT: oklchVar('--accent'), foreground: oklchVar('--accent-foreground') },
        destructive: { DEFAULT: oklchVar('--destructive'), foreground: oklchVar('--destructive-foreground') },
        border: oklchVar('--border'),
        input: oklchVar('--input'),
        ring: oklchVar('--ring'),
        // Woodlark brand palette
        cream: oklchVar('--cream'),
        walnut: oklchVar('--walnut'),
        'walnut-deep': oklchVar('--walnut-deep'),
        brass: oklchVar('--brass'),
        caramel: oklchVar('--caramel'),
        bark: oklchVar('--bark'),
        maroon: oklchVar('--maroon'),
        'maroon-deep': oklchVar('--maroon-deep'),
        whatsapp: oklchVar('--whatsapp'),
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
        '3xl': 'calc(var(--radius) + 12px)',
        '4xl': 'calc(var(--radius) + 16px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
