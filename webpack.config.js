const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const babelLoader = require.resolve('babel-loader');
const fileLoader = require.resolve('file-loader');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: [path.join(__dirname, 'src', 'index.tsx')],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/dist')
  },
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-source-map' : 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: babelLoader
      },
      {
        test: /\.(jpe?g|png|gif|svg|pdf)$/i,
        exclude: /node_modules/,
        loader: fileLoader,
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'assets/'
        }
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
    // sp the public folder is also recognized in dev, you have to copy it on your own for production use!
    contentBase: path.join(__dirname, 'public'),
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: true
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.join(__dirname, '/src/index.html'),
      filename: 'index.html',
      inject: 'body'
    }),
    isDev && new webpack.HotModuleReplacementPlugin()
  ].filter(Boolean)
};
