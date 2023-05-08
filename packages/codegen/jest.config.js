const base = require("../../jest.config.base.js");
const pack = require("./package");

module.exports = {
  ...base,
  displayName: pack.name,
  name: pack.name,
  coveragePathIgnorePatterns: [
    ...base.coveragePathIgnorePatterns,
    "/generated/",
  ],
  rootDir: ".",
  collectCoverageFrom: ["src/**/*.{js,ts}"],
};
