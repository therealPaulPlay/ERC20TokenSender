const Dotenv = require('dotenv-webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: path.resolve(__dirname, './main.js'),
      },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
      },
  plugins: [
    new HtmlWebpackPlugin({
        template: './index.html',
        favicon: "./favicon.ico"
      }),
    new Dotenv()
  ],
  module: {
    rules: [  
        {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ]
  },
  
}
