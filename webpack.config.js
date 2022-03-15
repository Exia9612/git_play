const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
//const VueLoaderPlugin = requires('vue-loader/lib/plugin')

// commonjs 规范 因为webpack用node实现的
module.exports = {
  mode: 'development',
  // inline 提示哪一行错误
  // cheap 提示业务代码那一行错误
  // module 提示loader和第三方哭错误
  // eval打包速度最快，不生成map文件，用eval提示打包文件与映射文件的对应关系
  //devtool: 'cheap-module-eval-source-map', development
  // cheap-module-source-map production
  devtool: 'eval-source-map', // sourceMap, 用于在浏览器上调试代码，报错时文件指向源代码的文件
  devServer: {
    contentBase: "./dist",
    // open: true, //打包完成后打开页面
    hot: true, //热更新
    //port: 3000,
    proxy: {
      // 请求代理
      '/api': {
        target: 'http://study.jsplusplus.com/',
        changeOrigin: true,
        pathRewrite: {
          // 路径重写
          '^/api': '' //相对路径以api开头的替换为空字符
        }
      }
    }
  },
  entry: './src/index.js', //入口文件，从那个文件开始打包
  module: {
    rules: [
      // {
      //   test: /\.vue$/,
      //   loader: 'vue-loader' //npm install -D vue-loader vue-template-compiler
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader', // 提供babel与webpack沟通
        // options下的配置可以写在.babelrc文件中
        // options: {
        //   // @babel/preset-env是es6语法转es5
        //   // presets: [['@babel/preset-env', {
        //   //   // 仅增加代码中使用的es6新特性(babel/poltfill = corejs + regenerator实现该功能)
        //   //   useBuiltIns: 'usage',
        //   //   corejs: 3, //corejs版本
        //   // }]]
        //   // bable.polyfill会在全局(window)挂载es6特性的实现，所以会污染全局
        //   // @babel/plugin-transform-runtime会给挂载到全局的es6特性更换名称，避免污染全局
        //   plugins: [['@babel/plugin-transform-runtime', {
        //     "absoluteRuntime": false,
        //     "corejs": 3,
        //     "helpers": true,
        //     "regenerator": true,
        //     "useESModules": false,
        //     "version": "7.0.0-beta.0"
        //   }]]
        // },
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif)$/i, // jpg结尾的文件使用什么loader
        use: {
          loader: 'url-loader', // 将图片导入到dist目录中并返回一个导入后的图片名字
          options: {
            // 对loader的配置
            name: '[name].[ext]', //与导入前名称相同
            outputPath: 'public/',
            limit: 20480 // 图片小于limit大小时生成base64，否则复制图片
          }
        }
      },
      {
        test: /\.scss$/,
        // loader执行顺序：从后往前
        // css-loader作用：根据css文件间的引用关系生成最终的一份css代码
        // style-loader：接受css-loader生成的css代码，加入到style标签中
        use: [
          'style-loader',
          {
            // 这种写法是避免webpack4早起版本bug
            // 在scss文件中引用另一个scss文件时，因为已经到了scss处理阶段，所以不会再走sass-loader处理scss文件
            // 这样写就是遇到再被引用的scss文件就往前找两个loader
            // 开发第三方库时考虑，安装npm install --save @babel/runtime-corejs3
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: true // css模块化写法
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader',]
        //use: ['vue-style-loader', 'css-loader', 'postcss-loader',]
      },
      {
        test: /\.(eot|svg|ttf|woff)/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html' //根据哪一个模版生成html
    }),
    new CleanWebpackPlugin(), // 打包之前清空输出文件中的内容
    new webpack.HotModuleReplacementPlugin()
    //new VueLoaderPlugin() //vue中对应的区块可以被对应的loade处理script -> babel css -> css-loader
  ],
  output: {
    filename: 'bundle.js', //打包后文件名字
    path: path.resolve(__dirname, 'dist'), // 打包后保存文件路径
  }
}