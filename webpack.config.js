module.exports = {
  mode: 'production',
  entry: [__dirname + '/../marlon-service-1/client/src/index.jsx', __dirname + '/../james-service-1/client/src/index.jsx'],
  output: {
    path: __dirname + '/public/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: __dirname + '/node_modules',
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/plugin-transform-runtime']
        }
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          },
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.jsx.html'],
    modules: ['./node_modules']
  }
};
