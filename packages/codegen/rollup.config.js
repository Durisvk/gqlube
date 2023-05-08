const json = require("@rollup/plugin-json");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const ts = require("@rollup/plugin-typescript");
const camelCase = require("lodash.camelcase");

const pkg = require("./package.json");
const libraryName = "codegen";

export default {
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
  plugins: [json(), ts(), commonjs(), nodeResolve({ preferBuiltins: true })],
};
