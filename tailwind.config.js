const colors = require("tailwindcss/colors");

// Must be in ./ and in ./packages/renderer
module.exports = {
  content: ["./index.html", "./packages/renderer/src/**/*.{vue,js,ts}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["Heebo"],
      serif: ["Noto"],
    },
    fontSize: {
      xs: ".8rem",
      sm: ".9rem",
      base: "1rem",
      lg: "1.1rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
    },
    extend: {
      colors: {
        currentColor: colors.currentColor,
        currentFill: colors.currentFill,
        primary: "#3772ff",
        alert: "#b24c63",
        info: "#fdca40",
        white: colors.white,
        black: "#333333",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
