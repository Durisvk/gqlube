const json = require("@rollup/plugin-json");
const ignore = require("rollup-plugin-ignore");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const ts = require("@rollup/plugin-typescript");
// @ts-ignore
const camelCase = require("lodash.camelcase");
const typescript = require("typescript");
const sourcemaps = require("rollup-plugin-sourcemaps");

const pkg = require("./package.json");
const libraryName = "core";

module.exports = {
  input: `src/index.ts`,
  output: [
    {
      name: camelCase(libraryName),
      file: pkg.main,
      format: "umd",
      sourcemap: true,
      sourcemapPathTransform: (sourcePath) => {
        if (sourcePath.startsWith("../../packages/src")) {
          return sourcePath.replace(
            "/packages/src",
            `/packages/${libraryName}/src`
          );
        }
        return sourcePath;
      },
    },
    {
      name: camelCase(libraryName),
      file: pkg.module,
      format: "es",
      sourcemap: true,
      sourcemapPathTransform: (sourcePath) => {
        if (sourcePath.startsWith("../../packages/src")) {
          return sourcePath.replace(
            "/packages/src",
            `/packages/${libraryName}/src`
          );
        }
        return sourcePath;
      },
    },
  ],
  external: [],
  watch: {
    include: "src/**",
  },
  plugins: [
    ignore(["stream", "http", "url", "https", "zlib"]),
    json(),
    ts({ typescript }),
    commonjs(),
    resolve({ browser: true, preferBuiltins: true }),
    sourcemaps(),
  ],
};
