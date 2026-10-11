/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#101C2C',
          navyLight: '#18273D',
          navyHover: '#1E324F',
          navyBorder: '#263C5E',
          blue: '#2057D5',
          blueHover: '#1747B5',
          blueLight: '#EBF1FD',
          orange: '#FF5A1F',
          orangeLight: '#FFF1EB',
          bg: '#F4F6FB',
          card: '#FFFFFF',
          textDark: '#0F172A',
          textMuted: '#64748B',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
