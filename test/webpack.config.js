var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './main.js',
  output: {
    path: __dirname + "/build",
    filename: 'bundle.js'
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js', '.jsx', '.styl'],
  },
  module: {
    loaders: [{
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
          plugins: ["transform-object-rest-spread"]
        }
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.less$/,
        loader: "style!css!less"
      },
      {
        test: /\.css$/,
        loader: "style!css"
      },
      // for icons to work
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }
    ]
  },
};

