/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Ubuntu Mono', 'MotorolaScreenType', 'monospace'], // Add more font names here
      },
      keyframes: {
        flashing: {
          '0%': { backgroundColor: 'rgba(255, 0, 0, 0.3)' }, // Lighter background color
          '50%': { backgroundColor: 'rgba(255, 50, 50, 1)' }, // Original background color
          '100%': { backgroundColor: 'rgba(255, 0, 0, 0.3)' }, // Lighter background color
        },
      },
      animation: {
        'ping-fast': 'flashing 0.5s infinite', // Adjust the animation duration
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
