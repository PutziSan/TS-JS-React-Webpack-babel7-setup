const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const babelLoader = require.resolve('babel-loader');
const sourceMapLoader = require.resolve('source-map-loader');
const fileLoader = require.resolve('file-loader');

const dev = process.env.NODE_ENV !== 'production';

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, '/src/index.html'),
  filename: 'index.html',
  inject: 'body'
});

const DefinePluginConfig = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production')
});

module.exports = {
  entry: [path.join(__dirname, 'src', 'app.tsx')],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/dist')
  },
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'inline-source-map' : 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: babelLoader
      },
      {
        test: /\.js$/,
        use: [sourceMapLoader],
        enforce: 'pre'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: fileLoader
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  devServer: {
    host: 'localhost',
    port: '3000',
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: true
  },
  plugins: dev
    ? [HTMLWebpackPluginConfig, new webpack.HotModuleReplacementPlugin()]
    : [HTMLWebpackPluginConfig, DefinePluginConfig]
};
