const path = require("path");

module.exports = {
  reactScriptsVersion: "react-scripts",
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
};