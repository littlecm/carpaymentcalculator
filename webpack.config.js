const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './paymentCalculatorEntry.js',
  output: {
    filename: 'paymentCalculator.js',
    path: path.resolve(__dirname, 'public'), // Change this to 'public'
    library: 'PaymentCalculator',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      "zlib": require.resolve("browserify-zlib"),
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer"),
      "assert": require.resolve("assert/"),
      "util": require.resolve("util/"),
      "fs": false // fs module is not meant for browser environment, so we can safely set it to false
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    }),
  ],
};
