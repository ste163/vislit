// jest.config.js
// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = async () => {
  return {
    verbose: true,
    haste: {
      // When I get the warning for having two haste-maps, try and change the path to the one in the error message
      // hasteImplModulePath: "./package.json",
    },
  };
};
