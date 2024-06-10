const { override, addWebpackAlias, addWebpackPlugin } = require('customize-cra');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    'stream': path.resolve(__dirname, 'node_modules/stream-browserify'),
  }),
  addWebpackPlugin(new NodePolyfillPlugin())
);
