/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],    // Poppins for general use
        inter: ['Inter', 'sans-serif'],        // Inter for readability-focused UI
        mono: ['Roboto Mono', 'monospace'],    // Roboto Mono for code/technical content
        sfTransRobotic: ['SF TransRobotic', 'sans-serif'],  // Custom font SF TransRobotic
        blanka: ['Blanka', 'sans-serif'],      // Custom font Blanka
        disposableDroidBB: ['DisposableDroidBB', 'sans-serif'], // Custom font DisposableDroidBB
        elianto: ['Elianto-Regular', 'sans-serif'],  // Custom font Elianto-Regular
      },
      colors: {
        gray: { 100: "#808080", 200: "#323232", 300: "#212121" },
        white: "#f7f9fb", // Updated white
        black: "#1e2337", // Added black
        cyan: "#14ffec",
        red: "#d6436e",
        green: "#25da72",
        blue: "#0098ea", // Added solid blue
        gold: "#fddc00", // Added gold
        purple: "#5a5fff", // Updated purple
        lightBlue: "#2d83ec", // Updated light blue
      },
      backgroundImage: {
        'light-blue': 'linear-gradient(to right, #2d83ec, #1ac9ff)', // Predefined light blue gradient
        'purple': 'linear-gradient(to right, #5a5fff, #6b7cfe)',      // Predefined purple gradient
      },

      animation: {
        glow: 'glow 1.5s ease-in-out infinite',
        flyIn: 'flyIn 5s cubic-bezier(0.25, 1, 0.5, 1)',
        coinFollow: 'coinFollow 1.5s cubic-bezier(0.25, 1, 0.5, 1) infinite',
        'bounce-2s': 'bounce 2s ease-in-out 1', // Bounce for 2 seconds, once
        breathing: 'breathing 3s infinite', // Custom breathing animation
      },
      keyframes: {
        glow: {
          '0%, 100%': { textShadow: '0 0 8px #fddc00, 0 0 16px #fddc00' },
          '50%': { textShadow: '0 0 16px #fddc00, 0 0 32px #fddc00' },
        },
        flyIn: {
          '0%': { transform: 'translateY(-200%)', opacity: 0 },
          '100%': { transform: 'translateY(0%)', opacity: 1 },
        },
        coinFollow: {
          '0%': { transform: 'translateY(100%) scale(0.5)', opacity: 0 },
          '50%': { transform: 'translateY(-50%) scale(1)', opacity: 1 },
          '100%': { transform: 'translateY(-100%) scale(0.8)', opacity: 0 },
        },
        breathing: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
