const path = require('path')

// commonjs 规范 因为webpack用node实现的
module.exports = {
  mode: 'development',
  entry: './src/index.js', //入口文件，从那个文件开始打包
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i, // jpg结尾的文件使用什么loader
        use: {
          loader: 'url-loader', // 将图片导入到dist目录中并返回一个导入后的图片名字
          options: {
            // 对loader的配置
            name: '[name].[ext]',
            outputPath: 'imgs/',
            limit: 20480 // 图片小于limit大小时生成base64，否则复制图片
          }
        }
      }
    ]
  },
  output: {
    filename: 'bundle.js', //打包后文件名字
    path: path.resolve(__dirname, 'dist'), // 打包后保存文件路径
  }
}