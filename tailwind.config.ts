import type { Config } from 'tailwindcss';

// Woodlark design tokens — preserved verbatim from the Lovable repo's styles.css
// so the converted site reads identically. The HSL/oklch vars themselves live
// in globals.css; this config just gives Tailwind utility classes for them
// (e.g. `bg-cream`, `text-walnut-deep`, `border-brass`).
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    container: { center: true, padding: '1.25rem', screens: { '2xl': '1440px' } },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: { DEFAULT: 'var(--card)', foreground: 'var(--card-foreground)' },
        popover: { DEFAULT: 'var(--popover)', foreground: 'var(--popover-foreground)' },
        primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
        secondary: { DEFAULT: 'var(--secondary)', foreground: 'var(--secondary-foreground)' },
        muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
        accent: { DEFAULT: 'var(--accent)', foreground: 'var(--accent-foreground)' },
        destructive: { DEFAULT: 'var(--destructive)', foreground: 'var(--destructive-foreground)' },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        // Woodlark brand tokens
        cream: 'var(--cream)',
        walnut: 'var(--walnut)',
        'walnut-deep': 'var(--walnut-deep)',
        brass: 'var(--brass)',
        caramel: 'var(--caramel)',
        bark: 'var(--bark)',
        maroon: 'var(--maroon)',
        'maroon-deep': 'var(--maroon-deep)',
        whatsapp: 'var(--whatsapp)',
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
      },
    },
  },
  plugins: [],
};

export default config;
