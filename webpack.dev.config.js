module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  stats: {
    preset: 'minimal',
    moduleTrace: true,
    errorDetails: true,
    warnings: false
  },
  devServer: {
    compress: true
  }
};
