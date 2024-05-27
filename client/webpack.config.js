const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');

module.exports = (env) => ({
  entry: './src/index.js',
  output: {
    filename: 'bundle.[contenthash].js',
    chunkFilename: '[contenthash].js',
    path: path.resolve(
      __dirname, 'dist',
    ),
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(
        __dirname, 'public', 'index.html',
      ),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
    new webpack.DefinePlugin({
      USE_MOCK_DATA: JSON.stringify(env.USE_MOCK_DATA === 'true'),
    }),
    new CopyWebpackPlugin({ // exposing only the asests folder to build
      patterns: [{
        from: 'public/assets/**/*',
        to: 'assets',
        noErrorOnMissing: true,
      }],
    }),
  ],
  devServer: {
    historyApiFallback: true,
    open: true,
    port: 3000,
    proxy: {
      '/api': {
        target: '', // todo add the api request location.
        secure: true,
        changeOrigin: false,
        headers: {
          Connection: 'keep-alive',
          Host: '', // todo add the host address
        },
        bypass(
          req, res, proxyOptions,
        ) {
          console.log(
            'PROXY', req.method, req.url,
          );
          // if (req.headers.accept.indexOf('html') !== -1) {
          //   console.log('Skipping proxy for browser request.');
          //   return '/index.html';
          // }
        },
      },
    },
  },
  optimization: {
    minimize: true, // To turn on CSS optimizer in dev
    minimizer: [
      '...',
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        minify: TerserPlugin.uglifyJsMinify,
        parallel: true,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
});
