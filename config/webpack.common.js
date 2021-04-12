const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const customConfig = require('../config.js');

// 解析出入口配置
const { entry: customEntry } = customConfig;

const entry = {}; // 入口配置
const htmlPageList = []; // html-webpack-plugin插件生成集合（多页面时创建构建多个html）

customEntry.forEach((item) => {
    entry[item.name] = item.src;

    htmlPageList.push(
        new HtmlWebpackPlugin({
            title: item.title, // HTML文档的标题
            filename: item.name + '.html', // HTML文件名
            template: path.resolve(
                __dirname,
                '..',
                `${item.template || './public/index.html'}`
            ),
            scriptLoading: 'defer', // 默认 'defer'，设置script标签的加载方式为异步
            favicon: '', // 将给定的图标图标路径添加到输出HTML，
            hash: false, // 如果是:true 则将唯一的webpack编译哈希值附加到所有包含的脚本和CSS文件中。这对于清除缓存很有用

            // chunks: 允许插入到模板中的一些chunk，不配置此项默认会将entry中所有的thunk注入到模板中。在配置多个页面时，每个页面注入的thunk应该是不相同的，需要通过该配置为不同页面注入不同的thunk；
            chunks: ['vendor', 'runtime', item.name], // 允许您仅添加一些块（例如，仅添加单元测试块）

            chunksSortMode: 'auto', // 'none' | 'auto' | 'manual' | {Function}

            minify: {
                // { Boolean|Object } 如果设置为true或配置对象 当mode是'production'，则将使用html-minifier-terser 和以下选项来缩小生成的HTML ：
                removeComments: true, // 删除注释
                collapseWhitespace: true, // 压缩空格
                removeEmptyAttributes: true, // 删除空引号属性
            }, // 要在生产模式下禁用缩小，请将minify选项设置为false。 当mode为'development'，也不会启用缩小
        })
    );
});

console.log(htmlPageList);

const commonCssLoader = [
    MiniCssExtractPlugin.loader,
    {
        loader: 'css-loader', // 解析 @import 和 url() 为 import/require() 方式处理
        options: {
            modules: false,
            importLoaders: 1, // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
        },
    },
    {
        loader: 'postcss-loader', // 在 css 中类似 babel 的功能
        options: {
            postcssOptions: {
                plugins: (loader) => [
                    require('precss')(), // 囊括了许多插件来支持类似 Sass 的特性，比如 CSS 变量，套嵌，mixins 等。
                    require('autoprefixer')(), // 添加了浏览器私有前缀，它使用 Can I Use 上面的数据，需要在 package.json 中配置 browserslist。
                ],
            },
        },
    },
];

module.exports = function (webpackEnv) {
    // 获取环境信息
    const isEnvProduction = webpackEnv === 'production';
    const isEnvDevelopment = webpackEnv === 'development';

    return {
        // webpack内部会把mode的值设置为process.env.NODE_ENV上
        target: 'web',
        mode: isEnvProduction
            ? 'production'
            : isEnvDevelopment && 'development',
        context: path.resolve(__dirname, '..'), // 设置上下文目录

        entry,
        output: {
            path: path.resolve(__dirname, '..', './dist'),
            filename: isEnvProduction
                ? 'js/[name].[contenthash].js'
                : isEnvDevelopment && 'js/[name].js',
            // chunkFilename ： 指未列在 entry 中，却又需要被打包出来的文件的名称。（如需懒加载的js文件）
            chunkFilename: isEnvProduction
                ? 'js/[name].[contenthash].chunk.js'
                : isEnvDevelopment && 'js/[name].chunk.js',
            publicPath: '', // js的公共路径  静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径
        },

        module: {
            // 模块、loader配置

            rules: [
                // 由下至上、由右至左执行
                // 配置单个loader可以用loader属性。  多个loader则可以： use: [ {}, {}, ... ]
                {
                    test: /\.jsx?$/, // 匹配文件类型的规则，如果是正则，不要加引号
                    exclude: /node_modules/, // 处理过程中需排除目录或文件
                    loader: 'babel-loader', // 所使用的loader
                    options: {
                        // loader（bebal-loader）的更多选项配置
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    modules: false,
                                    targets: {
                                        ie: '9',
                                    },
                                },
                            ],
                            '@babel/preset-react',
                        ], // 支持按需加载，自动支持最新 ES 版本，转换 react 语法
                        plugins: [
                            [
                                '@babel/plugin-proposal-decorators',
                                { decoratorsBeforeExport: false },
                            ], // 装饰器语法
                            '@babel/plugin-proposal-class-properties', // 类的私有属性语法
                            '@babel/plugin-transform-runtime',
                        ], // 保证 babel-polyfill 不会污染全局环境，供编译模块复用工具函数，减少打包体积， babel-runtime 生产环境使用
                    },
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loader: 'ts-loader',
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: [...commonCssLoader],
                },
                {
                    test: /\.less$/,
                    exclude: /node_modules/,
                    use: [
                        ...commonCssLoader,
                        'less-loader', // 解析 less 文件，类似的还有 sass-loader 和 postcss-loader
                    ],
                },
                // {
                //     test: /\.s(a|c)ss$/,
                //     exclude: /node_modules/,
                //     use: [...commonCssLoader, 'sass-loader'],
                // },
                {
                    test: /\.s(a|c)ss$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                // // 只在开发模式启用热更新
                                // hmr: isEnvDevelopment,
                                // // 如果模块热更新不起作用，重新加载全部样式
                                // reloadAll: true,
                            },
                        },
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.styl$/,
                    use: [...commonCssLoader, require.resolve('stylus-loader')],
                },
                {
                    test: /\.json$/,
                    type: 'javascript/auto',
                    loader: require.resolve('json-loader'),
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: require.resolve('html-loader'),
                            options: {
                                minimize: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpeg?|gif|svg)(\?.*)?$/,
                    exclude: /node_modules/,
                    loader: 'file-loader', // 把加载任何文件解析成打包文件，支持重命名，类似的还有 url-loader 支持 data URL 但不支持路径
                    options: {
                        // 解析时的参数
                        name: 'image/[name].[hash].[ext]', // 可配置信息很多，可以查询api
                        publicPath: '../', // 引用目录，由于从css加载，需要返回上一级
                    },
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    exclude: /node_modules/,
                    loader: 'file-loader', // 把加载任何文件解析成打包文件，支持重命名
                    options: {
                        // 解析时的参数
                        name: 'fonts/[name].[hash].[ext]', // 可配置信息很多，可以查询api
                    },
                },
            ],
        },
        resolve: {
            // 配置模块如何解析  不适用于对 loader 解析

            // 当import导入时如果路径没有写明文件类型的扩展名 或 文件夹下的某个文件时，所尝试的扩展名和文件名
            extensions: [
                '.js',
                '.json',
                '.jsx',
                '.ts',
                '.tsx',
                'index.js',
                'index.ts',
                'index.tsx',
                'index.jsx',
            ],
            alias: {
                // 设置别名。 当一些通用文件导入路径过长，可以通过设置别名缩短引入路径
                js: path.resolve(__dirname, '..', './assets/js'),
                css: path.resolve(__dirname, '..', './assets/css'),
            },
        },
        externals: {
            /**  防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。
             * 列如某个文件引入了 Jquery，但在webpack打包过程中不想让 Jquery参与构建依赖图且打包到最终的bundle中。
             * 就将 Jquery在这里进行外部扩展声明，然后在HTML模板文件中可以将 Jquery从CDN链接引入。
             *
             * 属性名称是 jquery，表示应该排除 import $ from 'jquery' 中的 jquery 模块。为了替换这个模块，
             * jQuery 的值将被用来检索一个全局的 jQuery 变量。换句话说，当设置为一个字符串时，它将被视为全局的（定义在上面和下面）。
             */
            jquery: 'jQuery',
            // 更多用法参照webpack官方配置
        },
        optimization: {
            // 性能优化

            splitChunks: {
                // chunks: 'async', // 提取的 chunk 类型，all: 所有，async: 异步，initial: 初始
                // minSize: 30000, // 默认值，新 chunk 产生的最小限制 整数类型（以字节为单位）
                // maxSize: 0, // 默认值，新 chunk 产生的最大限制，0为无限 整数类型（以字节为单位）
                // minChunks: 1, // 默认值，新 chunk 被引用的最少次数
                // maxAsyncRequests: 5, // 默认值，按需加载的 chunk，最大数量
                // maxInitialRequests: 3, // 默认值，初始加载的 chunk，最大数量
                // name: true, // 默认值，控制 chunk 的命名
                cacheGroups: {
                    // 配置缓存组
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor', // chunk名称
                        chunks: 'initial',
                        priority: 20, // 优先级
                        reuseExistingChunk: false, // 允许复用已经存在的代码块
                    },
                },
                /**
                 * 当 webpack 处理文件路径时，它们始终包含 Unix 系统中的 / 和 Windows 系统中的 \。
                 * 这就是为什么在 {cacheGroup}.test 字段中使用 [\\/] 来表示路径分隔符的原因。
                 * {cacheGroup}.test 中的 / 或 \ 会在跨平台使用时产生问题。
                 *
                 * 参照webpack文档
                 */
            },
        },
        performance: {
            // 性能提示，可以提示过大文件

            hints: 'warning', // 性能提示开关 false | "error" | "warning"
            maxAssetSize: 100000, // 生成的文件最大限制 整数类型（以字节为单位）
            maxEntrypointSize: 100000, // 引入的文件最大限制 整数类型（以字节为单位）
            assetFilter: function (assetFilename) {
                // 提供资源文件名的断言函数
                return /\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetFilename);
            },
        },
        plugins: [
            // 插件配置

            // 直接拷贝文件到指定目录
            new CopyWebpackPlugin({
                // from    定义要拷贝的源文件            from：__dirname+'/src/components'
                // to      定义要拷贝到的目标文件夹       to: __dirname+'/dist'
                // toType  file 或者 dir                可选，默认是文件
                // force   强制覆盖前面的插件            可选，默认是文件
                // context                            可选，默认base   context可用specific  context
                // flatten  只拷贝指定的文件              可以用模糊匹配
                // ignore  忽略拷贝指定的文件            可以模糊匹配

                patterns: [
                    {
                        from: './assets/', // 复制 assets/ 下的所有文件
                        //  to: './dist'  // 默认复制到 output.path 出口目录
                    },
                    // {
                    //     // 复制除assets外、其他目录下的文件
                    // }
                ],
            }),

            // 默认情况下：每次webpack重新构建后清空output.path目录下的所有文件。 ps：可配置
            new CleanWebpackPlugin(),

            // 分离css
            new MiniCssExtractPlugin({
                filename: isEnvProduction
                    ? 'css/[name].[contenthash].css'
                    : isEnvDevelopment && 'css/[name].css',
                chunkFilename: isEnvProduction
                    ? 'css/[name].[contenthash].chunk.css'
                    : isEnvDevelopment && 'css/[name].chunk.css',
            }),

            ...htmlPageList,
        ],
    };
};
