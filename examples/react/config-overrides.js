const path = require("path");

module.exports = function override(config, env) {
  config.resolve.plugins = config.resolve.plugins.filter(
    (plugin) =>
      !(plugin.constructor && plugin.constructor.name === "ModuleScopePlugin")
  );

  config.resolve.alias = {
    ...config.resolve.alias,
    react: path.resolve(__dirname, "node_modules/react"),
    "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
  };
  return config;
};
