import nodePolyfills from "rollup-plugin-node-polyfills";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import ts from "@rollup/plugin-typescript";
import camelCase from "lodash.camelcase";
import typescript from "typescript";

const pkg = require("./package.json");
const libraryName = "core";

export default {
  input: `src/index.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: "umd",
      sourcemap: true,
    },
    { file: pkg.module, format: "es", sourcemap: true },
  ],
  external: [],
  watch: {
    include: "src/**",
  },
  plugins: [
    nodePolyfills(),
    json(),
    ts({ typescript }),
    commonjs(),
    resolve({ preferBuiltins: true }),
  ],
};
