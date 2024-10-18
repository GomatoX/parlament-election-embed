const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

require("dotenv").config({ path: "./.env" });

module.exports = () => {
  return {
    mode: "production",
    entry: path.resolve(__dirname, "boot.js"),
    optimization: {
      usedExports: false,
    },
    output: {
      path: path.resolve(__dirname, "../dist"),
      filename: "boot.js",
    },
    plugins: [
      new Dotenv(),
      new HtmlWebpackPlugin({
        embed: process.env.REACT_APP_EMBED,
        filename: "index.html",
        template: "./scripts/index.html",
      }),
    ],
  };
};
