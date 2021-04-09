/* eslint-disable quotes */
/* eslint-disable key-spacing */
/* eslint-disable sort-keys */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable no-multi-spaces */
const path = require("path");

module.exports = {
	// entry: "./src/index.js",  // 单个入口
    // entry: ["./src/index.js", "./src/xxx.js"], // 文件路径数组传递
    // 对象语法会比较繁琐。然而，这是应用程序中定义入口的最可扩展的方式。
    // entry: { // 当通过插件生成入口时，可以传递空对象 {} 给 entry
        // app:"./src/app.js",
        // adminApp: "./src/adminApp.js",
        // main: "./src/index.js"    // main 自定义入口输出名称 ： "入口文件地址"

        // 单入口详细配置：
        // dependOn : 当前入口所依赖的入口，它(所依赖的入口)必须在当前入口加载前被加载 （要配置在当前入口的上面）
        // filename : 指定要输出的文件名称
        // import : 启动时需加载的模块
        // library : library的相关选项
        // runtime : 运行时的chunk名字。 会以这个名字命名去创建一个运行时的chunk，否则会使用现有的入口作为运行时
    
    //    main: {
            // runtime配置名称不能和其他入口名称重复，不可以指向入口
            // dependOn不能配置循环引用：即 app -- dependOn -> adminApp  ,  adminApp -- dependOn -> app
            // dependOn: "app", // dependOn 不能和 runtime 一起配置，会抛出错误。配置无效
    //         import: "./src/adminApp.js",
    //         runtime: "mainApp"
    //     }
    // },

    // 分离 app(应用程序) 和 vendor(第三方库) 入口 
    // 在 webpack < 4 的版本中，通常将 vendor 作为一个单独的入口起点添加到 entry 选项中，以将其编译为一个单独的文件（与 CommonsChunkPlugin 结合使用）。
    // entry: {
    //     main: './src/app.js',
    //     vendor: './src/vendor.js',
    // },
    // 而在 webpack 4 中不鼓励这样做。
    // 而是使用 optimization.splitChunks 选项，将 vendor 和 app(应用程序) 模块分开，并为其创建一个单独的文件。
    // 不要 为 vendor 或其他不是执行起点创建 entry。

    // 多页面应用程序配置entry
    // 告诉 webpack 需要三个独立分离的依赖图
    // entry: {
    //     pageOne: './src/pageOne/index.js',
    //     pageTwo: './src/pageTwo/index.js',
    //     pageThree: './src/pageThree/index.js'
    // },
    // 在多页面应用程序中，server 会拉取一个新的 HTML 文档给你的客户端。
    // 页面重新加载此新文档，并且资源被重新下载。
    // 然而，这给了我们特殊的机会去做很多事，例如使用 optimization.splitChunks 为页面间共享的应用程序代码创建 bundle。
    // 由于入口起点数量的增多，多页应用能够复用多个入口起点之间的大量代码/模块，从而可以极大地从这些技术中受益
    
    mode:'development', // 打包模式 development开发模式  production生产模式。  默认是生产模式
    entry: {
        // key : 如果是 ’路径/路径‘ ，则会在打包目录下(dist)自动创建目录文件夹，地址最后一位会作为文件输出名称
        "page/js/index": "./src/index.js",
        main: {
            filename: "page/js/main.js", // filename 配置 ’路径‘ 最后一位文件名称要加文件类型后缀
            import: "./src/main.js"
        }
    },
	output: {
        // filename: "bundle.js", // 自定义打包后的文件名字
		filename: "[name].js",  // [name] ： 取entry入口配置的输出名字
		path: path.resolve(__dirname, "dist")
	}
};