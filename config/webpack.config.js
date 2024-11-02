'use strict'

const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, '..', 'dist'),
    clean: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: ['package.json', 'package-lock.json'],
    }),
  ],
  externals: [nodeExternals()],
}
