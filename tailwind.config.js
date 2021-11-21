module.exports = {
  mode: "jit",
  purge: ['./index.html', '/packages/renderer/src/**/**.{vue,js,ts}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
