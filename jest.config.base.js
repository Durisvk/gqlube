module.exports = {
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
  testEnvironment: "node",
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  moduleFileExtensions: ["ts", "tsx", "js"],
  coveragePathIgnorePatterns: ["/node_modules/", "/__tests__/"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: ["packages/**/src/**/*.{js,ts}"],
  globals: {
    "ts-jest": {
      tsconfig: "../../tsconfig.test.json",
    },
  },
};
