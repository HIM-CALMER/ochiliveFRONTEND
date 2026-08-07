/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ochi: {
          bg: '#060712',
          surface: '#121a2c',
          accent: '#7d5f79',
          muted: '#7f8a9d',
          text: '#e7e9ef',
          accentSoft: '#645d7a',
        },
      },
    },
  },
  plugins: [],
}

