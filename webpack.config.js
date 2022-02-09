const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCSSExtractPlugin= require('mini-css-extract-plugin')
const copyPlugin = require('copy-webpack-plugin')
const cssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const terserPlugin = require('terser-webpack-plugin')
const dotenv = require('dotenv-webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/images/[hash][ext][query]'
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@utils' : path.resolve(__dirname, 'src/utils'),
      '@templates' : path.resolve(__dirname, 'src/templates'),
      '@styles' : path.resolve(__dirname, 'src/styles'),
      '@images' : path.resolve(__dirname, 'src/assets/images'),
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.s?css$/,
        use: [ miniCSSExtractPlugin.loader, 'css-loader', 'sass-loader' ]
      }
      ,{
        test: /\.png/,
        type: "asset/resource"
      },{
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name].[codehash][ext]",
        },
      }

    ] 
  },
  plugins: [
    new htmlWebpackPlugin({
      inject: true,
      template: './public/index.html',
      filename: './index.html'
    }),
    new miniCSSExtractPlugin({
      filename: 'assets/[name].[contenthash].css'
    }),
    new copyPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'src', 'assets/images'),
        to: 'assets/images'
      }]

    }),
    new dotenv(),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new cssMinimizerPlugin(),
      new terserPlugin(),
    ]
  }
}
