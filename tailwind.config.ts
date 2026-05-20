import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import animate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        headline: ['var(--font-headline)', ...fontFamily.sans],
        serif: ['var(--font-serif)', ...fontFamily.serif],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Luxury Brand Colors */
        gold: {
          50: '#FDF8E8',
          100: '#FAF0C8',
          200: '#F5E091',
          300: '#F0D05A',
          400: '#E8C035',
          500: '#D4AF37',
          600: '#B8962E',
          700: '#9A7D25',
          800: '#7C641C',
          900: '#5E4B13',
          DEFAULT: '#D4AF37',
        },
        navy: {
          50: '#F0F3F8',
          100: '#D9E0ED',
          200: '#B3C1DB',
          300: '#8DA3C9',
          400: '#6784B7',
          500: '#4A6FA5',
          600: '#1A2D4A',
          700: '#0F1F35',
          800: '#0A1628',
          900: '#050E1A',
          DEFAULT: '#0A1628',
        },
        charcoal: {
          50: '#F5F5F5',
          100: '#E6E6E6',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#808080',
          600: '#4D4D4D',
          700: '#333333',
          800: '#1A1A1A',
          900: '#0D0D0D',
          DEFAULT: '#1A1A1A',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      letterSpacing: {
        'widest': '0.2em',
        'wider': '0.15em',
        'wide': '0.08em',
        'tight': '-0.02em',
        'tighter': '-0.04em',
        'tightest': '-0.06em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37, #F5D37A, #D4AF37)',
        'gradient-gold-subtle': 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(245,211,122,0.05), rgba(212,175,55,0.1))',
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(212, 175, 55, 0.15)',
        'gold-lg': '0 8px 40px rgba(212, 175, 55, 0.2)',
        'gold-xl': '0 12px 60px rgba(212, 175, 55, 0.25)',
        'premium': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'premium-lg': '0 8px 40px rgba(0, 0, 0, 0.08)',
        'premium-xl': '0 20px 60px rgba(0, 0, 0, 0.1)',
        'inner-gold': 'inset 0 1px 0 rgba(212, 175, 55, 0.2)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
