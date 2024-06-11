const path = require('path');

module.exports = {
  entry: './paymentCalculatorEntry.js',
  output: {
    filename: 'paymentCalculatorBundle.js',
    path: path.resolve(__dirname, 'public'), // Ensure this points to the 'public' directory
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
    fallback: {
      fs: false,
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      assert: require.resolve('assert/'),
      util: require.resolve('util/'),
    },
  },
};
