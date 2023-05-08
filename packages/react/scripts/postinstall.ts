const fs = require("fs-jetpack");
const path = require("path");

console.log("Patching react-dom.development.js to support GQLube");
const reactDomDevelopmentPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "react-dom",
  "cjs",
  "react-dom.development.js"
);

if (!fs.exists(reactDomDevelopmentPath)) {
  console.warn(
    `react-dom.development.js was not found at ${reactDomDevelopmentPath}`
  );
}

const reactDomDevelopment = fs.read(reactDomDevelopmentPath);
// replace all occurences of `if (typeof newChild === 'function')` with `if (typeof newChild === 'function' && !newChild.${ID_FIELD}')`

const newReactDomDevelopment = reactDomDevelopment?.replace(
  /if \(typeof newChild === 'function'\)/g,
  `if (typeof newChild === 'function' && !newChild.______GQLUBE)`
);

if (newReactDomDevelopment) {
  fs.write(reactDomDevelopmentPath, newReactDomDevelopment);
  console.log("Successfully patched react-dom.development.js");
}
