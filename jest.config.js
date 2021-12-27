/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  globals: {
    "ts-jest": {
      isolatedModules: true,
      tsconfig: "tsconfig.json",
    },
    tsconfig: "tsconfig.json",
  },
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "jest-environment-node",
  moduleDirectories: ["types", "node_modules"],
  transform: {},
};
