// Needs to be in root and in /packages/renderer
module.exports = {
  content: ["./index.html", "./packages/renderer/src/**/*.{vue,js,ts}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
