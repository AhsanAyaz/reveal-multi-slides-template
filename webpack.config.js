const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: './js/index.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development', // Change to 'production' when ready to deploy
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'content', to: 'content' },
        { from: 'data', to: 'data' },
      ],
    }),
    new ESLintPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    open: true,
    port: 8000,
    hot: true,
  },
};
