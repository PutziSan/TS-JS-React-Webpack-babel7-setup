/* eslint-disable global-require */
const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SizePlugin = require('size-plugin');
const pgkJson = require('./package.json');

require('dotenv').config();

const babelLoader = require.resolve('babel-loader');
const fileLoader = require.resolve('file-loader');
const styleLoader = require.resolve('style-loader');
const cssLoader = require.resolve('css-loader');

const isDev = process.env.NODE_ENV === 'development';

const vendors = Object.keys(pgkJson.dependencies);

const vendorCacheGroups = {};

vendors.forEach(vendor => {
  vendorCacheGroups[vendor] = {
    test: new RegExp(`[\\\\/]node_modules[\\\\/]${vendor}[\\\\/]`),
    chunks: 'initial',
    name: vendor,
    enforce: true,
  };
});

const otherVendors = {
  test: new RegExp(
    `[\\\\/]node_modules[\\\\/](?!(?:${vendors.join('|')})).*[\\\\/]`
  ),
  chunks: 'initial',
  name: 'vendors',
  enforce: true,
};

module.exports = {
  entry: [path.join(__dirname, 'src', 'index.tsx')],
  output: {
    filename: isDev ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
    chunkFilename: isDev ? 'js/[id].js' : 'js/[name].[contenthash:8].js',
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
  },
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval' : 'source-map',
  resolve: {
    symlinks: false,
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: babelLoader,
      },
      {
        test: /\.css$/,
        use: [isDev ? styleLoader : MiniCssExtractPlugin.loader, cssLoader],
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf|pdf)$/i,
        loader: fileLoader,
        options: {
          name: isDev ? '[name].[ext]' : '[name].[hash:8].[ext]',
          outputPath: 'assets/',
        },
      },
    ],
  },
  devServer: {
    host: 'localhost',
    port: '3000',
    hot: true,
    contentBase: path.join(__dirname, 'public'),
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true,
    publicPath: '/',
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin(require('./dev/webpack/ugilfyJsPluginOptions')),
      new OptimizeCSSAssetsPlugin(require('./dev/webpack/optimizeCssOpts')),
    ],

    splitChunks: {
      minSize: 5000,
      // cacheGroups: Object.assign({}, vendorCacheGroups, { otherVendors }),
      cacheGroups: Object.assign({}, vendorCacheGroups, { otherVendors }),
    },
    // tested automatic vendor-splitting via splitChunks [optimization.splitChunks](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunks-maxasyncrequests)
    // but its currently not that good (explicit code-splitting may be ebther ATM)
    // good is `maxSize` https://webpack.js.org/plugins/split-chunks-plugin/#splitchunks-maxsize necessary with http/2, but currently it causes random bugs for real-world-app (apoly)

    // https://twitter.com/wSokra/status/969679223278505985 + https://webpack.js.org/configuration/optimization/#optimization-runtimechunk
    // https://twitter.com/wSokra/status/969679223278505985 + https://webpack.js.org/configuration/optimization/#optimization-runtimechunk
    runtimeChunk: 'single', // => runtimeChunk for longTermCaching so js-files have not to include the other chunks and not changed chunks could use the cached var
  },
  plugins: [
    new webpack.EnvironmentPlugin(Object.keys(process.env)),
    new HTMLWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
    isDev && new webpack.HotModuleReplacementPlugin(),
    !isDev && new MiniCssExtractPlugin(require('./dev/webpack/cssExtractOpts')),
    !isDev && new SizePlugin(),
  ].filter(Boolean),
};
