import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './sections/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                heading: ['var(--font-sora)', 'sans-serif'],
                body: ['var(--font-space-grotesk)', 'sans-serif'],
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    lg: '2rem',
                },
            },
            colors: {
                'light-gray': '#f2f2f2',
                'cover-deals': '#1f2324',
            },
            animation: {
                'ping-large': 'ping-large 1s ease-in-out infinite',
                'move-left': 'move-left 1s linear infinite',
                'move-right': 'move-right 1s linear infinite',
            },
            keyframes: {
                'ping-large': {
                    '75%, 100%': {
                        transform: 'scale(2)',
                        opacity: '0',
                    },
                },
                'move-left': {
                    '0%': {
                        transform: 'translateX(0%)',
                    },
                    '100%': {
                        transform: 'translateX(-50%)',
                    },
                },
                'move-right': {
                    '0%': {
                        transform: 'translateX(-50%)',
                    },
                    '100%': {
                        transform: 'translateX(0%)',
                    },
                },
            },
        },
    },
    plugins: [],
};
export default config;
