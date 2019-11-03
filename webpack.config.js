var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
    mode: 'development',
    context: __dirname,
    devtool: debug ? "inline-sourcemap" : null,
    entry: "./src/app.js",
    output: {
      path: __dirname + "/dist",
      filename: "bundle.js"
    },
    plugins: debug ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
  };