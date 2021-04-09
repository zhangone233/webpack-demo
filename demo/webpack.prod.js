const path = require("path");

module.exports = {
    mode: "production", // "production" | "development" | "none"
    // Chosen mode tells webpack to use its built-in optimizations accordingly.
    entry: "./app/entry", // string | object | array
    // 默认为 ./src
    // 这里应用程序开始执行
    // webpack 开始打包
    output: {
        // webpack 如何输出结果的相关选项
        path: path.resolve(__dirname, "dist"), // string (default)
        // 所有输出文件的目标路径
        // 必须是绝对路径（使用 Node.js 的 path 模块）
        filename: "[name].js", // string (default)
        // entry chunk 的文件名模板
        publicPath: "/assets/", // string
        // 输出解析文件的目录，url 相对于 HTML 页面
        library: {
            // 这里有一种旧的语法形式可以使用
            type: "umd", // 通用模块定义
            // the type of the exported library
            name: "MyLibrary", // string | string[]
            // the name of the exported library

            /* Advanced output.library configuration (click to show) */
        },
        uniqueName: "my-application", // (defaults to package.json "name")
        // unique name for this build to avoid conflicts with other builds in the same HTML
        name: "my-config",
        // name of the configuration, shown in output
        /* 高级输出配置 */
        /* Expert output configuration 1 (on own risk) */
        /* Expert output configuration 2 (on own risk) */
    },
    module: {
        // 模块配置相关
        rules: [
            // 模块规则（配置 loader、解析器等选项）
            {
                // Conditions:
                test: /\.jsx?$/,
                include: [path.resolve(__dirname, "app")],
                exclude: [path.resolve(__dirname, "app/demo-files")],
                // these are matching conditions, each accepting a regular expression or string
                // test and include have the same behavior, both must be matched
                // exclude must not be matched (takes preferrence over test and include)
                // Best practices:
                // - Use RegExp only in test and for filename matching
                // - Use arrays of absolute paths in include and exclude to match the full path
                // - Try to avoid exclude and prefer include
                // Each condition can also receive an object with "and", "or" or "not" properties
                // which are an array of conditions.
                issuer: /\.css$/,
                issuer: path.resolve(__dirname, "app"),
                issuer: { and: [/\.css$/, path.resolve(__dirname, "app")] },
                issuer: { or: [/\.css$/, path.resolve(__dirname, "app")] },
                issuer: { not: [/\.css$/] },
                issuer: [/\.css$/, path.resolve(__dirname, "app")], // like "or"
                // conditions for the issuer (the origin of the import)
                /* Advanced conditions (click to show) */

                // Actions:
                loader: "babel-loader",
                // 应该应用的 loader，它相对上下文解析
                options: {
                    presets: ["es2015"],
                },
                // options for the loader
                use: [
                    // apply multiple loaders and options instead
                    "htmllint-loader",
                    {
                        loader: "html-loader",
                        options: {
                            // ...
                        },
                    },
                ],
                type: "javascript/auto",
                // specifies the module type
                /* Advanced actions (click to show) */
            },
            {
                oneOf: [
                    // ... (rules)
                ],
                // only use one of these nested rules
            },
            {
                // ... (conditions)
                rules: [
                    // ... (rules)
                ],
                // use all of these nested rules (combine with conditions to be useful)
            },
        ],
        /* 高级模块配置（点击展示） */
    },
    resolve: {
        // options for resolving module requests
        // (does not apply to resolving of loaders)
        modules: ["node_modules", path.resolve(__dirname, "app")],
        // directories where to look for modules (in order)
        extensions: [".js", ".json", ".jsx", ".css"],
        // 使用的扩展名
        alias: {
            // a list of module name aliases
            // aliases are imported relative to the current context
            module: "new-module",
            // 别名："module" -> "new-module" 和 "module/path/file" -> "new-module/path/file"
            "only-module$": "new-module",
            // 别名 "only-module" -> "new-module"，但不匹配 "only-module/path/file" -> "new-module/path/file"
            module: path.resolve(__dirname, "app/third/module.js"),
            // alias "module" -> "./app/third/module.js" and "module/file" results in error
            module: path.resolve(__dirname, "app/third"),
            // alias "module" -> "./app/third" and "module/file" -> "./app/third/file"
            [path.resolve(__dirname, "app/module.js")]: path.resolve(
                __dirname,
                "app/alternative-module.js"
            ),
            // alias "./app/module.js" -> "./app/alternative-module.js"
        },
        /* 可供选择的别名语法（点击展示） */
        /* 高级解析选项（点击展示） */
        /* Expert resolve configuration (click to show) */
    },
    performance: {
        hints: "warning", // 枚举
        maxAssetSize: 200000, // 整数类型（以字节为单位）
        maxEntrypointSize: 400000, // 整数类型（以字节为单位）
        assetFilter: function (assetFilename) {
            // 提供资源文件名的断言函数
            return (
                assetFilename.endsWith(".css") || assetFilename.endsWith(".js")
            );
        },
    },
    devtool: "source-map", // enum
    // 通过为浏览器调试工具提供极其详细的源映射的元信息来增强调试能力，
    // 但会牺牲构建速度。
    context: __dirname, // string（绝对路径！）
    // webpack 的主目录
    // entry 和 module.rules.loader 选项
    // 都相对于此目录解析
    target: "web", // 枚举
    // the environment in which the bundle should run
    // changes chunk loading behavior, available external modules
    // and generated code style
    externals: ["react", /^@angular/],
    // Don't follow/bundle these modules, but request them at runtime from the environment
    externalsType: "var", // (defaults to output.library.type)
    // Type of externals, when not specified inline in externals
    externalsPresets: {
        /* ... */
    },
    // presets of externals
    ignoreWarnings: [/warning/],
    stats: "errors-only",
    stats: {
        // lets you precisely control what bundle information gets displayed
        preset: "errors-only",
        // A stats preset

        /* Advanced global settings (click to show) */

        env: true,
        // include value of --env in the output
        outputPath: true,
        // include absolute output path in the output
        publicPath: true,
        // include public path in the output

        assets: true,
        // show list of assets in output
        /* Advanced assets settings (click to show) */

        entrypoints: true,
        // show entrypoints list
        chunkGroups: true,
        // show named chunk group list
        /* Advanced chunk group settings (click to show) */

        chunks: true,
        // show list of chunks in output
        /* Advanced chunk group settings (click to show) */

        modules: true,
        // show list of modules in output
        /* Advanced module settings (click to show) */
        /* Expert module settings (click to show) */

        /* Advanced optimization settings (click to show) */

        children: true,
        // show stats for child compilations

        logging: true,
        // show logging in output
        loggingDebug: /webpack/,
        // show debug type logging for some loggers
        loggingTrace: true,
        // show stack traces for warnings and errors in logging output

        warnings: true,
        // show warnings

        errors: true,
        // show errors
        errorDetails: true,
        // show details for errors
        errorStack: true,
        // show internal stack trace for errors
        moduleTrace: true,
        // show module trace for errors
        // (why was causing module referenced)

        builtAt: true,
        // show timestamp in summary
        errorsCount: true,
        // show errors count in summary
        warningsCount: true,
        // show warnings count in summary
        timings: true,
        // show build timing in summary
        version: true,
        // show webpack version in summary
        hash: true,
        // show build hash in summary
    },
    devServer: {
        proxy: {
            // proxy URLs to backend development server
            "/api": "http://localhost:3000",
        },
        contentBase: path.join(__dirname, "public"), // boolean | string | array, static file location
        compress: true, // enable gzip compression
        historyApiFallback: true, // true for index.html upon 404, object for multiple paths
        hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
        https: false, // true for self-signed, object for cert authority
        noInfo: true, // only errors & warns on hot reload
        // ...
    },
    experiments: {
        asyncWebAssembly: true,
        // WebAssembly as async module (Proposal)
        syncWebAssembly: true,
        // WebAssembly as sync module (deprecated)
        outputModule: true,
        // Allow to output ESM
        topLevelAwait: true,
        // Allow to use await on module evaluation (Proposal)
    },
    plugins: [
        // ...
    ],
    // list of additional plugins
    optimization: {
        chunkIds: "size",
        // method of generating ids for chunks
        moduleIds: "size",
        // method of generating ids for modules
        mangleExports: "size",
        // rename export names to shorter names
        minimize: true,
        // minimize the output files
        minimizer: [new CssMinimizer(), "..."],
        // minimizers to use for the output files

        /* Advanced optimizations (click to show) */

        splitChunks: {
            cacheGroups: {
                "my-name": {
                    // define groups of modules with specific
                    // caching behavior
                    test: /\.sass$/,
                    type: "css/mini-extract",

                    /* Advanced selectors (click to show) */

                    /* Advanced effects (click to show) */
                },
            },

            fallbackCacheGroup: {
                /* Advanced (click to show) */
            },

            /* Advanced selectors (click to show) */

            /* Advanced effects (click to show) */

            /* Expert settings (click to show) */
        },
    },
    /* 高级配置（点击展示） */
    /* Advanced caching configuration (click to show) */
    /* Advanced build configuration (click to show) */
};
