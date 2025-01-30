/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          // Define your primary color palette
          50: "#f0f9ff",
          100: "#e0f2ff",
          200: "#c7e5ff",
          300: "#aed8ff",
          400: "#95caff",
          500: "#7cb8ff",
          600: "#63aaff",
          700: "#4a8cff",
          800: "#316eff",
          900: "#1850ff",
          950: "#0b32ff",
        },
        secondary: {
          // Define your secondary color palette
          50: "#f3e8ff",
          100: "#e7d5ff",
          200: "#d1bfff",
          300: "#ba9dff",
          400: "#a37bff",
          500: "#8c58ff",
          600: "#7536ff",
          700: "#5e14ff",
          800: "#4700ff",
          900: "#3000ff",
          950: "#1900e6",
        },
        accent: {
          // Define an accent color if needed
          50: "#fff0cc",
          100: "#ffe8ad",
          200: "#ffe08b",
          300: "#ffd869",
          400: "#ffd047",
          500: "#ffc825",
          600: "#e6b41f",
          700: "#cc9f18",
          800: "#b38a12",
          900: "#99750c",
          950: "#7f5f06",
        },
        // ... other custom colors
      },
      fontFamily: {
        // Define your preferred font families
        sans: ["Inter", "sans-serif"], // Example using Inter font
        serif: ["Merriweather", "serif"], // Example using Merriweather font
        mono: ["Roboto Mono", "monospace"], // Example using Roboto Mono font
      },
      fontSize: {
        // Customize font sizes if needed
        "2xs": "0.625rem",
        "3xs": "0.5rem", // Smaller than default
        "4xs": "0.375rem", // Even smaller
        "5xl": "3rem",
        "6xl": "4rem",
        "7xl": "5rem",
      },
      borderRadius: {
        // Customize border radii
        lg: "0.5rem", // Slightly larger default radius
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        // Customize box shadows
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // More prominent shadow
      },
      transitionProperty: {
        // Add custom transition properties
        "colors-opacity":
          "color, background-color, border-color, text-decoration-color, fill, stroke, opacity",
      },
      keyframes: {
        // Define custom keyframes for animations
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        // Define custom animations
        wiggle: "wiggle 1s ease-in-out infinite",
      },
      // ... other theme extensions
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // If you are using forms
    // require('@tailwindcss/typography'), // If you want to use the typography plugin
    // ... other plugins
  ],
};
