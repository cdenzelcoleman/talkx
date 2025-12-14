/** @type {import('tailwindcss').Config} */
module.exports = {
  // I'm using 'class' strategy so I can programmatically toggle dark mode
  // by adding/removing 'dark' class on the document element
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // I'm defining custom colors to match Twitter's aesthetic
        primary: '#1DA1F2',  // Twitter blue
        dark: {
          bg: '#15202B',       // Main dark background
          surface: '#192734',  // Cards/surfaces in dark mode
          border: '#38444D',   // Borders in dark mode
          text: '#FFFFFF',     // Primary text in dark mode
          textMuted: '#8899A6', // Secondary text in dark mode
        },
        light: {
          bg: '#FFFFFF',       // Main light background
          surface: '#F7F9F9',  // Cards/surfaces in light mode
          border: '#E1E8ED',   // Borders in light mode
          text: '#14171A',     // Primary text in light mode
          textMuted: '#657786', // Secondary text in light mode
        }
      }
    },
  },
  plugins: [],
}
