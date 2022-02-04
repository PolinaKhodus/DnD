/* eslint-disable linebreak-style */
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');// eslint-disable-line import/no-extraneous-dependencies
const MiniCssExtractPlugin = require('mini-css-extract-plugin');// eslint-disable-line import/no-extraneous-dependencies

module.exports = {
  entry: './src/index.js',
  optimization: {
    minimize: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },

      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },

      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader',
        ],
      },

      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },

    ],
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],

  devServer: {
    contentBase: path.join(__dirname, 'src'),
    open: true,
    port: 9000,
  },
};
