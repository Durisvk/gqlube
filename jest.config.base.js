module.exports = {
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
  testEnvironment: "jsdom",
  testRegex: "(/__tests__/.*\\.(test|spec))\\.(ts|tsx|js)$",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleFileExtensions: ["ts", "tsx", "js"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/",
    "/src\\/index.ts/",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 75,
    },
  },
  collectCoverageFrom: ["packages/**/src/**/*.{js,ts}"],
  globals: {
    "ts-jest": {
      tsconfig: "../../tsconfig.test.json",
    },
  },
};
