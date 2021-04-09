// Node API 方式
// 在使用node api时，还可以根据配置中的 plugins 属性传入插件

const webpack = require("webpack"); // 访问webpack的运行时（runtime）
const configuration = require("./webpack.dev.js");

let compiler = webpack(configuration);

new webpack.ProgressPlugin().apply(compiler);

compiler.run(function (err, stats) {
    // ..
    console.log(err);
    console.log(stats);
});

// node some-node-script.js
