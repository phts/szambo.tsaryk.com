'use strict'

const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/app.ts',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, '..', 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        'package.json',
        'package-lock.json',
        {from: '.env', noErrorOnMissing: true},
        {from: 'src/**/*.html', to: '[name][ext]'},
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: [nodeExternals()],
}
