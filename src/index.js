// 在输出文件中增加·es6新特性的实现，如promise,Array.map
// 按需引入后不需要仔导入全部的es6特性
// 但按需引入后需要安装core-js(npm install --save core-js@3.8.3)，否则按需引入无法找到core-js，也就无法引入对应的代码
// import '@babel/polyfill';

const promiseArray = [
  new Promise(() => {}),
  new Promise(() => {})
]

promiseArray.map(promise => {
  console.log('promise', promise)
})