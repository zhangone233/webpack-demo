/* eslint-disable sort-keys */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
const path = require("path");
const webpack = require("webpack"); // 访问内置的插件
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (() => {
    return {
        mode: "development",
        target: "web",

        devtool: "source-map", // 开启source-map
        // source-map ：在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的source map，但是它会减慢打包速度；
        // cheap-module-source-map : 在一个单独的文件中生成一个不带列映射的map，不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便；
        // eval-source-map : 使用eval打包源文件模块，在同一个文件中生成干净的完整的source map。这个选项可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，在生产阶段则一定不要启用这个选项；
        // cheap-module-eval-source-map : 这是在打包文件时最快的生成source map的方法，生成的Source Map会和打包后的JavaScript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点；

        // entry: {
        //     "page/js/index": "./src/index.js",
        //     "page/js/main": "./src/main.js",
        //     "page/ts/app": "./src/app.ts",
        // },

        // context : 指定上下文绝对路径。基础目录
        context: path.resolve(__dirname, "src"),
        entry: {
            // "page/js/index": "./index.js", // ./src/index.js
            // "page/js/main": {
            //     import: "./main.js",
            //     library: {
            //         name: "myLibrary",
            //         type: "window",
            //     },
            // },
            // "page/ts/app": {
            //     import: "./app.ts",
            //     library: {
            //         name: "myLibrary2",
            //         type: "window",
            //     },
            // },

            "page/js/index": ['./index.js','./main.js','./app.ts']
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            // filename: "[name].[chunkhash:4].js",
            filename: "static/[name].[chunkhash:4].js",
            // "static/page/js/index.js"  最终文件路径：__dirname/dist/static/page/js/index.hash.js

            // [id] : 使用webpack内部打包默认的唯一 id
            // [name] : 使用入口名称

            // [hash] : 使用webpack每次构建过程中，所生成的唯一 hash 值  (默认长度20) 。 构建一次生成一个hash，所有文件公用一个hash。
            // 只要有一个文件发生更改，重新构建之后所有的文件hash都会改变 （不利于缓存）
            // [hash:10] : 指定hash的长度  (取hash的前面10位)

            // [chunkhash] : 使用基于每个chunk内容的hash。
            // 根据不同的入口文件进行解析，构建对应的chunk。生成每个chunk单独的hash值，其中一个chunk的代码发生更改，其他chunk的hash值则不会改变

            // [contenthash] : 文件内容hash
            // 虽然chunkhash分别独立生成了hash。但如果一个chunk里面index.css被index.js引用了，两个文件一个chunk，共同的hash。
            // 如果index.js发生了改变，index.css即使没有任何更改，由于是chunk模块发生了改变，导致index.css也会重新构建
            // 这个时候，我们可以使用extra-text-webpack-plugin里的contenthash值，保证即使css文件所处的模块里就算其他文件内容改变，只要css文件内容不变，那么不会重复构建。

            // var extractTextPlugin = require('extract-text-webpack-plugin'),
            // module.exports = {
            //     ...
            //     ...
            //     output:{
            //     path:path.join(__dirname, '/dist/js'),
            //     filename: 'bundle.[name].[chunkhash].js',
            //     },
            //     plugins:[
            //          new extractTextPlugin('../css/bundle.[name].[contenthash].css')
            //     ]
            // }

            // library: ['myLibrary','[name]'],
        },

        // 本地服务器配置
        devServer: {
            index: "new-index.html",
            contentBase: path.join(__dirname, "dist"), // 本地服务打开的目录文件
            port: 18888, // 本地服务端口号 --port 8080
            host: '127.0.0.1', // 指定域名
            hot: true, // 是否模块热替换
            // hotOnly: true,
            // open: true, // 是否自动打开浏览器 --open
            // inline: true, // 源代码改变是否自动刷新
            compress: true, // 是否为服务的所有内容启用gzip压缩：

            // historyApiFallback: true, // 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
            // proxy: {}, // 配置代理

            // 对于浏览器请求，您想要提供HTML页面，但是需要代理它的API请求。你可以做这样的事情：
            // proxy: {
            //     "/api": {
            //         target: "http://localhost:3000",
            //         bypass: function (req, res, proxyOptions) {
            //             if (req.headers.accept.indexOf("html") !== -1) {
            //                 console.log("Skipping proxy for browser request.");
            //                 return "/index.html";
            //             }
            //         },
            //     },
            // },

            // 如果要代理多个指向同一个目标的特定路径，可以使用具有一个context属性的一个或多个对象的数组：
            // proxy: [
            //     {
            //         context: ["/auth", "/api"],
            //         target: "http://localhost:3000",
            //     },
            // ],

            // 提供在服务器内部的所有其他中间件之前执行定制中间件的功能。这可以用来定义自定义处理程序，例如：
            before(app) {
                app.get("/some/path", function (req, res) {
                    res.json({ custom: "response" });
                });
            },

            // 提供在服务器内部的所有其他中间件之后执行定制中间件的功能。
            after(app) {
                // do fancy stuff
            },
        },

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    use: "babel-loader",
                },
                {
                    test: /\.ts$/,
                    use: "ts-loader",
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
            ],
        },
        plugins: [
            // webpack内置插件，用于自定义编译过程中的进度报告
            new webpack.ProgressPlugin(),

            // 模块热加载: 当源代码改动命令行会自动编译
            new webpack.HotModuleReplacementPlugin(),

            // 在热加载时直接返回更新文件名，而不是文件的id。 适用于webpack4版本及以下
            // new webpack.NamedModulesPlugin(),

            // 指定一个html模板路径,打包完成后会自动根据模板创建一个html入口模板文件，并自动引入打包后的js和其他bundle
            // 如果不指定模板（不传参数），那么会根据默认的webpack模板规范生成一个入口文件html
            // new HtmlWebpackPlugin({ template: './src/index.html' }),
            new HtmlWebpackPlugin({
                template: "./index.html",
                filename: "new-index.html",
            }),
        ],
    };
})();
