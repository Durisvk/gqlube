const external = require("rollup-plugin-peer-deps-external");
const json = require("@rollup/plugin-json");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const ts = require("@rollup/plugin-typescript");
const camelCase = require("lodash.camelcase");
const typescript = require("typescript");

const pkg = require("./package.json");
const libraryName = "react";

export default {
  input: `src/index.ts`,
  output: [
    {
      name: camelCase(libraryName),
      file: pkg.main,
      format: "umd",
      sourcemap: true,
      globals: {
        react: "React",
      },
    },
    {
      name: camelCase(libraryName),
      file: pkg.module,
      format: "es",
      sourcemap: true,
      globals: {
        react: "React",
      },
    },
  ],
  external: ["react"],
  watch: {
    include: "src/**",
  },
  plugins: [
    external(),
    json(),
    commonjs(),
    nodeResolve({
      browser: true,
      preferBuiltins: true,
      dedupe: ["react", "react-dom"],
    }),
    ts({
      typescript,
      tsconfig: "./tsconfig.json",
      sourceMap: true,
      inlineSources: true,
    }),
  ],
};
