const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfigFunc = require('./webpack.common.js');
const customConfig = require('../config.js');

const { devServer } = customConfig;
const baseConfig = baseConfigFunc('development'); // 执行config配置构建函数，且传入当前打包环境

// 加入配置
const serveConfig = {
    hot: true, // 开启热替换
    contentBase: path.resolve(__dirname, '..', './dist'), // 本地服务启动以后打开的目录
};
// 加入插件
const servePlugins = [
    new webpack.HotModuleReplacementPlugin(), // 热替换插件，在 module 对象里加入 hot 属性
];

// 合并
Object.assign(devServer, serveConfig);
baseConfig.plugins.concat(servePlugins);

// console.log(merge(baseConfig, {
//     devtool: 'source-map', // 开启完整的 source-map （构建较慢一点）
//     devServer, // 合并 devServer 配置
// }));
module.exports = merge(baseConfig, {
    devtool: 'source-map', // 开启完整的 source-map （构建较慢一点）
    devServer, // 合并 devServer 配置
});
