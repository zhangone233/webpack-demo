// 导入入口配置
const configJson = require('./config.json');

// 配置不同环境的服务器域名
const getHost = function (env = 'dev') {
    let url = '';
    switch (env) {
        case 'dev':
            url = 'dev.com';
            break;
        case 'test':
            url = 'test.com';
            break;
        case 'stage':
            url = 'stage.com';
            break;
        case 'online':
            url = 'online.com';
            break;
    }
    return url;
};

// 配置代理
const proxyHost = getHost('test');
const proxy = {
    target: `http://${proxyHost}/`, // 目标服务器域名
    changeOrigin: true, // 将请求头中的 host 设置为 target。 否则请求头的 Request URL 仍然是浏览器发过来的host（本地域名）
    secure: false, // 是否验证 SSL 证书。 如果是 https 协议需要打开这个，设为true
    bypass: function (req, res, proxyOptions) {
        // 对于浏览器请求，想要提供 HTML 页面，但是对于 API 请求，想要代理它。 可以执行以下操作：
        if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
        }
    },
};

// 配置 devServer
const port = 9999;
const host = '127.0.0.1';
const devServer = {
    host,
    port,
    proxy: {
        '/api/**': proxy,
        '/admin/**': {
            target: 'http://localhost:3000',
            pathRewrite: { '^/admin': '' }, // 需要重写路径
        },
    },

    // 将多个特定路径代理到同一目标
    // proxy: [
    //     {
    //         context: ['/auth', '/api'],
    //         target: 'http://localhost:3000',
    //     },
    // ],

    openPage: 'page-b.html', // 服务启动以后默认打开的页面
};

module.exports = {
    entry: configJson.entry,
    devServer,
};
