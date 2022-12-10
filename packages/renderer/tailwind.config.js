const config = require("../../tailwind.config");

// Must be in ./ and in ./packages/renderer
module.exports = {
  ...config,
  content: ["./src/**/*.{vue,js,ts}"],
};
