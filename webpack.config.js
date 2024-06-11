const path = require("path");

module.exports = {
  entry: "./paymentCalculatorEntry.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "paymentCalculatorBundle.js",
    library: "PaymentCalculator",
    libraryTarget: "umd",
  },
  resolve: {
    fallback: {
      assert: require.resolve("assert/"),
      util: require.resolve("util/"),
      buffer: require.resolve("buffer/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
