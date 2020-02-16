const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/views/js')
    }
  },
  entry: './src/views/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}