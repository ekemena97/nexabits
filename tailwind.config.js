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
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
