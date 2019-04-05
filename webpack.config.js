const webpack = require('webpack');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

function root(filePath) {
  return path.resolve(__dirname, filePath);
}

module.exports = {
  mode: 'development',

  entry: {
    app: root('src/index.tsx'),
  },

  output: {
    path: root('dist'),
    publicPath: '/',
    filename: '[name].js',
  },

  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },

  devServer: {
    contentBase: root('dist'),
    compress: true,
    port: process.env.PORT || 3000,
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
          },
        ],
      },
      {
        test: /\.ts$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [[require('@babel/preset-typescript')]],
        },
      },
      {
        test: /\.tsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            [
              require('@babel/preset-react'),
              require('@babel/preset-typescript'),
            ],
          ],
        },
      },
    ],
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: root('src/index.html'),
    }),
  ],
};
