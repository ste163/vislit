const colors = require("tailwindcss/colors");

// Must be in ./ and in ./packages/renderer
module.exports = {
  content: ["./src/**/*.{vue,js,ts}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["Heebo"],
      serif: ["Noto"],
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
