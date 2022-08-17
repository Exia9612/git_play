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


