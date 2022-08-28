# webpack入口entry
webpack简单入口配置如下，下述配置表示从当前根目录下的index.js开始打包，打包得到bundle.js。entry表示的就是资源入口文件，我们可以看到它是一个相对路径
```javascript
const path = require('path')

module.exports = {
  entry: './index.js',
  output: {
    path: path(__dirname, ''),
    filename: 'bundle.js'
  },
  mode: none // b不压缩打包的文件
}
```

## webpack基础目录context
- context表示基础目录，表示资源入口entry从哪个目录为起点，值为一个字符串，表示绝对路径
- 下面的配置表示从工程根目录下src文件夹下的js文件夹里的index.js开始打包
- 一般我们不会去设置context，在我们没有设置context的时候，它是当前工程的根目录
```javascript
const path = require('path');  
module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: './js/index.js',  // index.js里又引入了b.js
  output: {
    path: path.resolve(__dirname, ''),
    filename: 'bundle.js'
  },
  mode: 'none'
};
```

## webpack资源入口entry的表达形式
上述的entry都是字符串的表达形式，除此之外它还可以是数组，对象和函数

### 数组形式
表示的含义是数组最后一个文件为入口文件，数组中其余文件需要预先构建到入口文件中
```javascript
module.exports = {
  entry: ['a.js', 'b.js', 'index.js']
}
```
上述写法等价于
```javascript
// index.js
import 'a.js'
import 'b.js'
//webpack.config.js
module.exports = {
  entry: 'index.js'
}
```

### 对象形式
- 入口entry是对象形式的又称之为多入口配置。之前都是单入口的配置，本质上打包后生成一个JS文件
- 下面的配置分别从两个入口文件(index.js, vendor/index.js)打包，每个入口文件各自寻找依赖的模块打包成一个js文件，最终得到两个js文件
```javascript
const path = require('path');  
module.exports = {
  entry: {
    app: ['a.js', 'b.js', 'index.js'],
    vendor: './vendor'
  },
  output: {
    path: path.resolve(__dirname, ''),
    filename: 'bundle.js'
  },
  mode: 'none'
};
```

### 函数形式
- 函数形式的入口，Webpack取函数返回值作为入口配置，返回值是上述3种之一即可。
- 函数形式的entry，可以用来做一些额外的逻辑处理，不过在自己搭脚手架的很少使用。


# Webpack 出口output
webpack简单出口配置如下，output是一个对象，有几个重要属性filename, path, publicPath, chunkFilename
```javascript
const path = require('path')

module.exports = {
  entry: './index.js',
  output: {
    path: path(__dirname, ''),
    filename: 'bundle.js'
  },
  mode: none // b不压缩打包的文件
}
```
## output.filename
- filename除了可以是一个文件名称还可以是一个相对地址，最终打包输出的文件是绝对路径与相对路径拼接的地址
- filename还支持变量的方式生成动态文件名，如：[hash]-bundle.js [name]-bundle.js
## output.path
- 资源打包后输出的位置，默认为dist目录
## output.publicPath
- 资源访问路径，表示浏览器应该访问的资源存放位置
- 相对路径表示
  
  以当前浏览的页面url是 https://www.apple.com/ipad/ ,要访问的资源名称是bundle-3fa2.js为例讲解
  1. output.publicPath以"./"或"../"等开头，表示要访问的资源以当前页面url作为基础路径
  ```javascript
  publicPath: ''  //https://www.apple.com/ipad/bundle-3fa2.js
  publicPath: '../dist/'  //https://www.apple.com/dist/bundle-3fa2.js
  publicPath: './dist/'   //https://www.apple.com/ipad/dist/bundle-3fa2.js
  ```
  2. output.publicPath以"/"开头，表示要访问的资源以当前页面的服务器地址作为基础路径
  ```javascript
  publicPath: '/'  //https://www.apple.com/bundle-3fa2.js
  publicPath: '/dist/'  //https://www.apple.com/dist/bundle-3fa2.js
  ```
- 绝对路径表示

  使用CDN时，publicPath以http协议名称开始

  还有一种叫做相对协议的形式，它以 // 开头，也就是省略了前面的https:或http:，在使用相对协议的时候，浏览器会对前页面使用的协议名称与相对协议拼接。
  ```javascript
  publicPath: "https://cdn.apple.net/"  // 资源的访问地址是https://cdn.apple.net/bundle-3fa2.js
  publicPath: "http://cdn.apple.net/"  // 资源的访问地址是http://cdn.apple.net/bundle-3fa2.js
  publicPath: "//cdn.apple.net/dist/"  // 资源的访问地址是https://cdn.apple.net/dist/bundle-3fa2.js
  ```
## output.chunkFilename
- 表示非入口文件打包后生成的chunk名称，通常在使用异步模块时会生成非入口文件的chunk

## hash、chunkhash和contenthash区别
### 浏览器缓存
可以通过在响应头中添加cache-control头控制浏览器把资源缓存在本地。但是当某个资源变动时，我们怎么让浏览器重新请求资源呢？
一个办法就是为文件设置一个独特的文件名，例如a-8arf5s45.js，当a-8arf5s45.js的文件内容没有改变时，webpack打包后生成的文件名就一直会是a-8arf5s45.js。在html中会一直引入a-8arf5s45.js
```html
<script src="a-8arf5s45.js"></script>
```
如果代码内容变化，a-8arf5s45.js打包后的名字就会改变，浏览器就会重新去请求该文件。
为了确保资源变动后可以生成唯一的8arf5s45，webpack可以在出口output中为打包后生成的文件名配置[hash/chunkhash/contenthash]
### Webpack与hash算法
- 在使用webpack对项目进行构建的时候，webpack会根据所有文件内容计算出一个特殊的字符串[hash]，只要文件内容变化了，该hash字符串就会被改变。
### webpack中hash、chunkhash和contenthash的区别
- hash chunkhash contenthash都是根据文件内容计算出的hash值，只是计算的文件不一样
- hash是根据打包中所有文件计算hash值。在一次打包中所有出口文件的filename获得hash值是一样的
- chunkhash是根据打包过程中当前chunk计算出的hash值。如果Webpack配置是多入口配置，那么通常会生成多个chunk，每个chunk对应的出口filename获得的[chunkhash]是不一样的
- contenthash有点像chunkhash，是根据打包时CSS内容计算出的hash值。一般在使用提取CSS的插件的时候，我们使用contenthash。例如下面的配置，我们生成的CSS文件名可能会是main.3aa2e3c6.css

# loader配置
预处理器的本质是一个函数，它接受一个资源模块，然后将其处理成webpack能使用的形式。因为webpack在不进行任何配置的时候只能处理js和json文件模块
## 预处理器的配置和使用
### 预处理器的关键配置
```javascript
const path = require('path')

module.exports = {
  entry: './a.js', // a.js引入了css文件
  output: {
    path: path(__dirname, ''),
    filename: 'bundle.js'
  },
  modules: {
    rules:[
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
        include: /src/
      }
    ]
    mode: none
  }
}
```
- 预处理器是在moduels下的rules配置项里设置的，rules定义预处理器的处理规则
- rules中test是一个正则表达式或正则表达式数组，某块文件名与正则表达式相匹配的会被use属性的预处理器处理
- use可以是字符串，字符串数组或对象表示需要使用的预处理器，预处理器的使用顺序是从后向前的
- exclude表示那些文件不想被某个预处理器处理，可以是字符串或正则表达式，字符串需要是绝对路径
- include表示预处理器只处理哪些文件
- include与exclude同时存在时，webpack优先使用exclude

### 常用的loader配置
#### babel-loader
- 将es6代码转换为es5代码
- babel是一系列工具的集合，webpack主要使用babel-loader这个预处理器来使用babel功能
- @babel/preset-env是babel转码的预设
```javascript
const path = require('path')

module.exports = {
  entry: './a.js',
  output: {
    path: path(__dirname, ''),
    filename: 'bundle.js'
  },
  modules: {
    rules:[
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node_modules/
      }
    ]
    mode: none
  }
}
```

#### file-loader和url-loader
- file-loader是文件资源预处理器，用来处理文件导入语句并替换成文件的访问地址，同时把文件输出到相应位置
```javascript
// css
.background {
  url(test.jpg)
}

// webpack.config.js
const path = require('path')

module.exports = {
  entry: './a.js' // 引入了·css文件,
  output: {
    path: path(__dirname, ''),
    filename: 'bundle.js'
  },
  modules: {
    rules:[
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }，
      {
        test: /\.jpg$/,
        use: 'file-loader'
      }
    ]
    mode: none
  }
}
```
- url-loader是file-loader的增强版，增加了base64编码能力，对于文件小雨一定体积时可以用base64编码替换访问地址，减少一次网络请求
- 当文件体积待遇阈值时，url-loader本质上是用file-loader处理
```javascript
// css
.background {
  url(test.jpg)
}

// webpack.config.js
const path = require('path')

module.exports = {
  entry: './a.js' // 引入了·css文件,
  output: {
    path: path(__dirname, ''),
    filename: 'bundle.js'
  },
  modules: {
    rules:[
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }，
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024 * 8
          }
        }
      }
    ]
    mode: none
  }
}
```
- 两者处理后的资源名称默认为[contenthash].[ext],contenthash是资源内容的hash值，ext是文件拓展名
- 处理后的资源访问地址默认使用output.publicPath，也可以在rules的options里配置publicPath，它会覆盖output.publicPath
```javascript

// webpack.config.js
const path = require('path')

module.exports = {
  entry: './a.js' // 引入了·css文件,
  output: {
    path: path(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  modules: {
    rules:[
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024 * 8,
            name: [name]-[contenthash].[ext],//重新定义输出资源的名称
            publicPath: './dist' // 资源访问路径为当前目录下的dist文件夹
          }
        }
      }
    ]
    mode: none
  }
}
```































