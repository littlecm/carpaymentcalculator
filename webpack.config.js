const path = require('path');

module.exports = {
  entry: './paymentCalculatorEntry.js',
  output: {
    filename: 'paymentCalculator.js',
    path: path.resolve(__dirname, 'dist'),
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
  },
};