const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

require('dotenv').config();

const babelLoader = require.resolve('babel-loader');
const fileLoader = require.resolve('file-loader');
const styleLoader = require.resolve('style-loader');
const cssLoader = require.resolve('css-loader');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: [path.join(__dirname, 'src', 'index.tsx')],
  output: {
    filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
    chunkFilename: isDev ? '[id].js' : '[id].[contenthash:8].js',
    path: path.join(__dirname, '/dist'),
    pathinfo: isDev
  },
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval' : 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: babelLoader
      },
      {
        test: /\.css$/,
        use: [isDev ? styleLoader : MiniCssExtractPlugin.loader, cssLoader]
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf|pdf)$/i,
        loader: fileLoader,
        options: {
          name: isDev ? '[name].[ext]' : '[name].[hash:8].[ext]',
          outputPath: 'assets/'
        }
      }
    ]
  },
  devServer: {
    host: 'localhost',
    port: '3000',
    hot: true,
    contentBase: path.join(__dirname, 'public'),
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin(require('./dev/webpack/ugilfyJsPluginOptions')),
      new OptimizeCSSAssetsPlugin(require('./dev/webpack/optimizeCssOpts'))
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin(Object.keys(process.env)),
    new HTMLWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      filename: 'index.html',
      inject: 'body'
    }),
    isDev && new webpack.HotModuleReplacementPlugin(),
    !isDev && new MiniCssExtractPlugin(require('./dev/webpack/cssExtractOpts'))
  ].filter(Boolean)
};
