const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dev = require('./webpack.dev.config');
const prod = require('./webpack.prod.config');

const ASSET = path.resolve(__dirname, './assets');

const baseConfig = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, './dist'),
    asyncChunks: false,
    assetModuleFilename: 'images/[hash][ext][query]'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(t|j)s?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg|webp)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.mp3$/i,
        include: ASSET,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'ts'],
      quiet: true
    }),
    new MiniCssExtractPlugin({ filename: 'bundle.css' }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
      favicon: './assets/favicon.ico',
      minify: true
    })
  ]
};

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode ? prod : dev;

  return merge(baseConfig, envConfig);
};
