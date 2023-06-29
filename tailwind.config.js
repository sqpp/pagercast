module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        screen: ['MotorolaScreenType', 'monospace'],
      },
      boxShadow: {
        'inner-xl': 'inset 0 3px 3px 3px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        flashing: {
          '0%': { backgroundColor: 'rgba(255, 0, 0, 0.3)' },
          '50%': { backgroundColor: 'rgba(255, 50, 50, 1)' },
          '100%': { backgroundColor: 'rgba(255, 0, 0, 0.3)' },
        },
        'extended-shake': {
          '0%': { transform: 'translateX(0)' },
          '5%': { transform: 'translateX(-2px)' },
          '10%': { transform: 'translateX(2px)' },
          '15%': { transform: 'translateX(-2px)' },
          '20%': { transform: 'translateX(2px)' },
          '25%': { transform: 'translateX(-2px)' },
          '30%': { transform: 'translateX(2px)' },
          '35%': { transform: 'translateX(-2px)' },
          '40%': { transform: 'translateX(2px)' },
          '45%': { transform: 'translateX(-2px)' },
          '50%': { transform: 'translateX(2px)' },
          '55%': { transform: 'translateX(-2px)' },
          '60%': { transform: 'translateX(2px)' },
          '65%': { transform: 'translateX(-2px)' },
          '70%': { transform: 'translateX(2px)' },
          '75%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' },
          '85%': { transform: 'translateX(-2px)' },
          '90%': { transform: 'translateX(2px)' },
          '95%': { transform: 'translateX(-2px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'ping-fast': 'flashing 0.5s infinite',
        'extended-shake': 'extended-shake 1.5s',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
