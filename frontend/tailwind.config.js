module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        taskflow: {
          50: '#f0f3ff',
          100: '#e6eeff',
          200: '#c7d0ff',
          300: '#9fb3ff',
          400: '#747fff',
          500: '#5461ff',
          600: '#3d3dff',
          700: '#2d2bdb',
          800: '#2424b5',
          900: '#1e1a8f',
        },
        'dark-bg': '#0f172a',
        'dark-card': '#1e293b',
        'dark-border': '#334155',
        'green-primary': '#10b981',
        'green-dark': '#059669',
        'green-light': '#6ee7b7',
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}
