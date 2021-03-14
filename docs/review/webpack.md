### webpack
[优质链接](https://juejin.cn/post/6844904094281236487)

[mini-babel](https://github.com/jamiebuilds/the-super-tiny-compiler)

1. 首先，npm init -y 创建一个 package.json 文件
2. npm install webpack webpack-cli -D（大写是当道 devDepends 里的，小写就直接放依赖里了）
3. 创建 src/index.js
4. npx webpack --mode=development，这里看下，为啥用 npx，因为以前 npm 装 webpack 等命令行工具都要-g 的，污染全局，
   用了 npx 后，它会去自动找到本地项目下的命令。webpack 默认打包的话，是不会打包没有引用的 js 文件的。import 后是可以的
5. 这个时候，打包的文件是不是会变成 es5 代码的，所以要安装 babel-loader 并配置。装了 babel 后还要配置 babel，就是要装 env（转译代码）,transform-runtime（ 用了这个可以节省很多重复的代码，）corejs（配置 useBuiltIns 的时候必须要有 corejs3（不然会默认使用 2,会有些实例还是需要额外的 polyfill），可以用来按需引用转译模块）useBuiltIns 是用于 polyfill 的，这个是 env 里带的
6. @babel/runtime 和 corejs 因为跑起来的时候需要用到他们，所以他们要作为生产依赖安装。
7. webpack.config.js 里使用 mode: 'development' ，可以在代码中通过 process.env.NODE_ENV 获取，就是我们常见的配置开发或者是生产环境。实际上，webpack 打包后的文件里,process.env.NODE_ENV 会被打包成'development'字符串。
8. 使用 html-webpack-plugin 插件可以让 html 自动引入 js 文件，并且利用它的配置的话也是可以定制化呈现 html，方便不同渠道的业务。
9. 想让它跑起来并且能够实时刷新的话，需要 webpack-dev-server 插件，然后执行命令的时候不是 webpack 了，而是 webpack-dev-server
10. 想让它跑起来后，这个时候 console 的话，会映射到打包后的代码，如果想让他映射到原来的代码的话，因此，综合构建速度，在开发模式下，我设置的 devtool 的值是 cheap-module-eval-source-map。
    开发环境推荐：
    cheap-module-eval-source-map
    生产环境推荐：
    cheap-module-source-map，但是我通常排查错误的方式是直接代理一下，除了编译错误，其它的一下就能找到错误的位置明细了。
11. 想让 css 跑起来的话，要装不少插件 style-loader （动态创建 style 标签，将 css 插入到 head 中.）less-loader css-loader（负责处理 @import 等语句） postcss-loader(兼容) autoprefixer。loader 执行顺序是从右往左的。
12. 当然，loader 其实还有一个参数，可以修改优先级，enforce 参数，其值可以为: pre(优先执行) 或 post (滞后执行)。其实你配置的时候配置好不久行了吗？
13. url-loader 配置可以读文件，背景图片，大小限制，小于限制的变 dataUrl
14. 处理 html 上的本地图片，需要安装 html-withimg-loader 插件,但是这样的话，之前的 html 模板语言就不能用了
15. 配置 output 时，有一个 publickPath: '/'，直接就是根目录，配置成'/truck/',`http://localhost:3000/truck/` 就是默认的 indexhtml 展示的位子。build 完了后，资源会变成'./truck/xxxx'；
16. 使用 clean-webpack-plugin 可以清空每次 dist 文件，防止 bundle 太多找不到.
17. .babelrc 的配置，会优先 webpack.config 里的配置。
18. 像浏览器的配置，可以放.browserslistrc 文件里，更清晰，而且可以多个 loader 共享使用
19. 我要是想用 react，需要安装 react 的 babel 预设，webpack 配置里要加一个
    ```js
    resolve: {
      extensions: ['.js', '.jsx','.json']
    },
    ```
    这样我的 jsx 文件就不需要写全称了。
20. 安装@babel/plugin-proposal-class-properties 才可以在类里用箭头函数。
21. 代码里使用
    import('./handle').then(fn => {
    const sum = fn.sum;
    console.log(sum(3, 5));
    });
    import('./handle').then((res)=> res.default); res.default 就是那个组件
    可以做到按需加载，在执行到这段代码后才会加载。
    而且已经替代掉 require.ensure 了。
    import()只是一个语法糖，当前模块没有加载时，内部会发起一个 JSONP 请求来加载目标代码模块， 返回值是一个 Promise 对象，可以在 then 方法内得到真正的模块。
    在 output 设置里，chunkFilename:'[name].js'可以把文件实际化，不然就是 id.js 了
22. webpack 的 resolve 配置很有用，可以里面配 `modules: [path.resolve(__dirname, 'node_modules')]`,这样可以不用引路径，可以加 `extenstion`，这样不用写.jsx，它会默认从左往右查，所以使用频率最高的放前面。
    还可以设置别名 `alias: {'react-native': '@my/react-native-web' //这个包名是我随便写的哈}`，这样代码里就直接引入 react-native 而不是后者
23. DefinePlugin 配合 dotenv 这个库，可以在.env 里写环境变量，webpack 首行直接 require('ditenv').config();这些环境变量就被打到了 process.env 里了。然后利用.env.vm，和服务器交互即可。可以利用它们，来做符合自己业务不同的环境
24. exculde 优先级是高于 include 的
25. 使用 cache-loader 或者是 babel-loader 下参数 cacheDirectory 设置为 true，可以让它在构建的过程尝试读取缓存，提高编译时间。
26. 使用 `HappyPack` 插件让 webpack 在构建的时候可以同时处理多个子进程，提高构建时间。
27. 如果使用了不需要构建的第三方依赖，如 Jquery 或者是 loadsh,可以用 module: { noParse: /jquery|loadsh/ } 来搞定。
28. 如果使用了第三方的包的时候，自己的代码需要用到 import \$ from 'jquery'，可以配置 externals: { 'jquery': 'jQuery'} ,这样全局就会有 jQuery 变量了。
29. webpack 自己会有 tree-shaking 功能，没有 import 的代码它不会打包出来。使用 scope hosting，可以自动省略不必要的代码。比如只写了 let a = 1;let b = 2;let c = a+b;console.log(c);它会直接打包成 console.log(3);前面的都没了。
30. manifest 是给映射资源用的，比如 ssr 的时候，都会写好 js,css 的路径，但是打包的时候，会给它添加一个 hash 值

```js
{
  "main.css": "main.198b3634.css",
  "main.js": "main.d312f172.js",
  "index.html": "index.html"
}

const buildPath = require('./dist/manifest.json');

res.send(`
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>ssr</title>
<link href="${buildPath['main.css']}" rel="stylesheet"></head>
<body>
  <div id="app"></div>
<script type="text/javascript" src="${buildPath['main.js']}"></script></body>
</html>
`);
```

这样就可以返回正确的路径了

31. 如何开启 gzip? 如何 localhost 代理访问开发接口？

```js
//webpack.config.js
module.exports = {
    //...
    devServer: {
        port: '3000', //默认是8080
        quiet: false, //默认不启用，启用了看不到wepback的错误日志。
        inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
        stats: "errors-only", //终端仅打印 error
        overlay: false, //默认不启用,启用了的话，开发时候编译错误会直接打到屏幕上。
        clientLogLevel: "silent", //日志等级
        compress: true //是否启用 gzip 压缩,
        proxy: {
            '/index':{ // 这个是你要替换的位置

            /** 比如你要讲http://localhost:8080/index/xxx 替换成 http://10.20.30.120:8080/sth/xxx

            * 那么就需要将 index 前面的值替换掉, 或者说是替换掉根地址,

            *你可能发现了index也是需要替换的, 没错, 我会在后续操作中处理.
            */

            target: 'http://10.20.30.120:8080'//这个是被替换的目标地址

            changeOrigin: true // 默认是false,如果需要代理需要改成true

            pathRewrite:{
                '^/index' : '/' //在这里 http://localhost:8080/index/xxx 已经被替换成 http://10.20.30.120:8080/
            }}
        }

    }
}

```

32. webpack热更新原理

  `Hot Module Replacement`，简称HMR，无需完全刷新整个页面的同时，更新模块。HMR的好处，在日常开发工作中体会颇深：节省宝贵的开发时间、提升开发体验。

  首先，我们知道Hash值代表每一次编译的标识。
  
  其次，根据新生成文件名可以发现，上次输出的Hash值会作为本次编译新生成的文件标识。依次类推，本次输出的Hash值会被作为下次热更新的标识。

  它会埋两个js作为入口的平级
    1.  `webpack-dev-server/client/index.js` 用于webSocket通信，因为我启动的是本地服务，然后客户端要和我通信，就要有代码，所以偷偷埋一个，用来通信
    2. 一个是 `webpack/hot/dev-server.js` 用于检查更新逻辑。

  `webpack-dev-server` 跑起来后，会生成一个`compiler`实例，启动server，并且启动websocket服务

  利用 `compiler.watch` 方法，写在 `webpack-dev-middleware` 里

  首先对本地文件代码进行编译打包，也就是webpack的一系列编译流程。

  其次编译结束后，开启对本地文件的监听，当文件发生变化，重新编译，编译完成之后继续监听。
  
  内部可能会是用 `fs.watch | fs.watchFile` 来监听的。

  至于开发环境没有dist，实际上是存在内存里了，用的 `memory-fs`

  当我监听到文件的变化后，会重新编译，当编译结束后，通过HMR插件来检查是否需要热更新

  利用上一次保存的 hash 值，调用 hotDownloadManifest 发送xxx/hash.hot-update.json的ajax请求

  ![tu](https://user-gold-cdn.xitu.io/2019/12/1/16ec04289af752da?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

  返回的结果中，h代表本次新生成的Hash值，用于下次文件热更新请求的前缀。c表示当前要热更新的文件对应的是index模块。

  然后通过 动态创建srcipt src的形式，请求 `xxx/hash.hot-update.js` 文件

  ![tu2](https://user-gold-cdn.xitu.io/2019/12/1/16ec04316d6ac5e3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

  而这个js里的代码，会立即执行一个 `webpackHotUpdate` 方法，方法里面就是这次改动的文件代码，然后通过`hotApply`进行代码替换

  完整的大概流程这样的
  ![tu3](https://user-gold-cdn.xitu.io/2019/9/2/16cf203824359397?imageslim)
