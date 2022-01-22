const {override, fixBabelImports, addLessLoader} = require('customize-cra');

module.exports = override(
  //config-overrides.js文件使用babel-plugin-import，根据import引入的antd包，实现按需打包。
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,  // 自动打包相关的样式
  }),

  // 使用less-loader对源码中的less的变量进行 重新指定/覆盖
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': '#1DA57A'},//less中默认的主题颜色。
  }),
)