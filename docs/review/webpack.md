[优质链接](https://juejin.cn/post/6844904094281236487)

[mini-babel](https://github.com/jamiebuilds/the-super-tiny-compiler)

01. Webpack 的运行流程

    webpack 流程是一个串行的过程, 从启动到结束会依次执行以下流程 :

    01. 初始化参数：从配置文件和 Shell 语句中读取与合并参数,得出最终的参数。
    02. 开始编译：用上一步得到的参数初始化 Compiler 对象,加载所有配置的插件,执行对象的 run 方法开始执行编译。
    03. 确定入口：根据配置中的 entry 找出所有的入口文件。
    04. 编译模块：从入口文件出发,调用所有配置的 Loader 对模块进行翻译,再找出该模块依赖的模块,再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
    05. 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后,得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
    06. 输出资源：根据入口和模块之间的依赖关系,组装成一个个包含多个模块的 Chunk,再把每个 Chunk 转换成一个单独的文件加入到输出列表,这步是可以修改输出内容的最后机会。
    07. 输出完成：在确定好输出内容后,根据配置确定输出的路径和文件名,把文件内容写入到文件系统。

    在以上过程中, Webpack 会在特定的时间点广播出特定的事件, 插件在监听到感兴趣的事件后会执行特定的逻辑, 并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

02. webpack 需要注意的点

    01. npm install webpack webpack-cli -D（大写是当道 devDepends 里的，小写就直接放依赖里了）
    02. npx webpack --mode=development，这里看下，为啥用 npx，因为以前 npm 装 webpack 等命令行工具都要-g 的，污染全局

        用了 npx 后，它会去自动找到本地项目下的命令。webpack 默认打包的话，是不会打包没有引用的 js 文件的。import 后是可以的

    03. 安装 `babel-loader` 并配置。装了 babel 后还要配置 babel，就是要装 `babel/preset-env（转译代码）`,  `plugin-transform-runtime`（ 用了这个可以节省很多重复的代码，）`runtime-corejs`（配置 useBuiltIns 的时候必须要有 corejs3（不然会默认使用 2, 会有些实例还是需要额外的 polyfill），可以用来按需引用转译模块）useBuiltIns 是用于 polyfill 的，这个是 env 里带的
    04. 插件的执行顺序是从前往后，preset预设的执行顺讯是从后往前，插件在预设前运行, 预设其实就是插件的组合包。
    05. @babel/runtime 和 corejs 因为跑起来的时候需要用到他们，所以他们要作为生产依赖安装。
    06. webpack.config.js 里使用 mode: 'development' ，可以在代码中通过 process.env.NODE_ENV 获取，就是我们常见的配置开发或者是生产环境。实际上，webpack 打包后的文件里,process.env.NODE_ENV 会被打包成'development'字符串。
    07. 使用 html-webpack-plugin 插件可以让 html 自动引入 js 文件，并且利用它的配置的话也是可以定制化呈现 html，方便不同渠道的业务。
    08. 想让它跑起来后，这个时候 console 的话，会映射到打包后的代码，如果想让他映射到原来的代码的话，因此，综合构建速度
        - 开发环境推荐： `cheap-module-eval-source-map`
        - 生产环境推荐： `cheap-module-source-map`
    但是我通常排查错误的方式是直接代理一下，除了编译错误，其它的一下就能找到错误的位置明细了。

    9. 想让 css 跑起来的话，要装不少插件 style-loader （动态创建 style 标签，将 css 插入到 head 中.）less-loader css-loader（负责处理 @import 等语句） postcss-loader(兼容) autoprefixer。loader 执行顺序是从右往左的。
    10. 当然，loader 其实还有一个参数，可以修改优先级，enforce 参数，其值可以为: pre(优先执行) 或 post (滞后执行)。其实你配置的时候配置好不久行了吗？
    11. url-loader 配置可以读文件，背景图片，大小限制，小于限制的变 dataUrl
    12. 处理 html 上的本地图片，需要安装 html-withimg-loader 插件,但是这样的话，之前的 html 模板语言就不能用了
    13. 配置 output 时，有一个 publickPath: '/'，直接就是根目录，配置成'/truck/',  `http://localhost:3000/truck/` 就是默认的 indexhtml 展示的位子。build 完了后，资源会变成'./truck/xxxx'；
    14. 使用 clean-webpack-plugin 可以清空每次 dist 文件，防止 bundle 太多找不到.
    15. .babelrc 的配置，会优先 webpack.config 里的配置。
    16. 像浏览器的配置，可以放.browserslistrc 文件里，更清晰，而且可以多个 loader 共享使用
    17. 我要是想用 react，需要安装 react 的 babel 预设，webpack 配置里要加一个

        ```js
        resolve: {
            extensions: ['.js', '.jsx', '.json']
        }
        ```
        这样我的 jsx 文件就不需要写全称了。

    18. 安装`@babel/plugin-proposal-class-properties` 才可以在类里用箭头函数。
    19. 在 output 设置里，chunkFilename:'[name].js'可以把文件实际化，不然就是 id.js 了
    
    20. webpack 的 resolve 配置很有用，可以里面配 `modules: [path.resolve(__dirname, 'node_modules')]`, 这样可以不用引路径
    21. 可以加 `extenstion`，这样不用写.jsx，它会默认从左往右查，所以使用频率最高的放前面。
    22. 还可以设置别名 `alias: {'react-native': '@my/react-native-web' //这个包名是我随便写的哈}` ，这样代码里就直接引入 react-native 而不是后者
    23. `DefinePlugin` 配合 dotenv 这个库，可以在.env 里写环境变量，webpack 首行直接 require('ditenv').config();这些环境变量就被打到了 process.env 里了。然后利用`.env.vm`，和服务器交互即可。可以利用它们，来做符合自己业务不同的环境
    24. exculde 优先级是高于 include 的
    25. 使用 `cache-loader` 或者是 `babel-loader` 下参数 cacheDirectory 设置为 true，可以让它在构建的过程尝试读取缓存，提高编译时间。
    26. 使用 `HappyPack` 插件让 webpack 在构建的时候可以同时处理多个子进程，提高构建时间。
    27. 如果使用了不需要构建的第三方依赖，如 Jquery 或者是 loadsh,可以用 module: { noParse: /jquery|loadsh/ } 来搞定。
    28. 如果使用了第三方的包的时候，自己的代码需要用到 `import $ from 'jquery'`，可以配置 externals: { 'jquery': 'jQuery'} ,这样全局就会有 jQuery 变量了。
    29. webpack 自己会有 `tree-shaking` 功能，没有 import 的代码它不会打包出来。
    30. 使用 `scope hosting`，可以自动省略不必要的代码。比如只写了 let a = 1;let b = 2;let c = a+b;console.log(c);它会直接打包成 console.log(3);前面的都没了。

3. webpack 按需加载是怎么做到的？

    ```js
    import('./handle').then(fn => {
        const sum = fn.sum;
        console.log(sum(3, 5));
    });
    import('./handle').then((res)=> res.default); 
    // res.default 就是那个组件
    ```
    可以做到按需加载，在执行到这段代码后才会加载，已经替代掉 `require.ensure` 了。

    import()只是一个语法糖，当前模块没有加载时，内部会发起一个 JSONP 请求来加载目标代码模块， 返回值是一个 Promise 对象，可以在 then 方法内得到真正的模块。

4. Loader和 Plugin的区别
    - Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，对其他类型的资源进行转译的预处理工作。
    - Plugin 就是插件，基于事件流框架 Tapable，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
    - Loader 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性。
    - Plugin 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入。  

5. manifest

    一旦你的应用在浏览器中以 index.html 文件的形式被打开，一些 bundle 和应用需要的各种资源都需要用某种方式被加载与链接起来。在经过打包、压缩、为延迟加载而拆分为细小的 chunk 这些 webpack 优化 之后，你精心安排的 /src 目录的文件结构都已经不再存在。所以 webpack 需要它

    它是给映射资源用的，比如 ssr 的时候，都会写好 js,css 的路径，但是打包的时候，会给它添加一个 hash 值

    使用 DllPlugin 进行分包，使用 DllReferencePlugin(索引链接) 对 manifest.json 引用，让一些基本不会改动的代码先打包成静态资源，避免反复编译浪费时间。HashedModuleIdsPlugin 可以解决模块数字id问题

    ``` js
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

6. 如何开启 gzip? 如何 localhost 代理访问开发接口？

    ``` js
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
                '/index': { // 这个是你要替换的位置

                    /** 比如你要讲http://localhost:8080/index/xxx 替换成 http://10.20.30.120:8080/sth/xxx

                    * 那么就需要将 index 前面的值替换掉, 或者说是替换掉根地址,

                    *你可能发现了index也是需要替换的, 没错, 我会在后续操作中处理.
                    */

                    target: 'http://10.20.30.120:8080' //这个是被替换的目标地址

                    changeOrigin: true // 默认是false,如果需要代理需要改成true

                    pathRewrite: {
                        '^/index': '/' //在这里 http://localhost:8080/index/xxx 已经被替换成 http://10.20.30.120:8080/
                    }
                }
            }

        }
    }
    ```

7. 文件监听原理是什么

    轮训判断文件的最后编辑事件是否有变化，然后到了执行时间后开始再次编译。

8. webpack热更新原理
    [参考1](https://zhuanlan.zhihu.com/p/30669007)
    [参考2](https://juejin.cn/post/6844904008432222215)

    早期的webpack确实是个SSE协议，后来才改的WS

    总结版：
    
    客户端从服务端拉去更新后的文件，准确的说是 chunk diff (chunk 需要更新的部分)，实际上 WDS 与客户端之间维护了一个 Websocket，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起 Ajax 请求来获取更改内容(文件列表、hash)，这样客户端就可以再借助这些信息继续向 WDS 发起 jsonp 请求获取该chunk的增量更新。最后由 hotApply 方法执行更新

    Hash值代表每一次编译的标识。
    
    它会埋两个js作为入口的平级

    1. `webpack-dev-server/client/index.js` 用于webSocket通信，因为我启动的是本地服务，然后客户端要和我通信，就要有代码，所以偷偷埋一个，用来通信
    2. 一个是 `webpack/hot/dev-server.js` 用于检查更新逻辑。

    过程：

    1. `webpack-dev-server` 跑起来后，会生成一个 `compiler` 实例，启动server，并且启动websocket服务

    2. `webpack-dev-middleware` 调用 `compiler.watch` 方法，这个方法做两件事

        1. 首先对本地文件代码进行编译打包，也就是webpack的一系列编译流程。

        2. 其次编译结束后，开启对本地文件的监听，当文件发生变化，重新编译，编译完成之后继续监听。
    
        内部可能会是用 `fs.watch | fs.watchFile` 来监听的。

    3. 当我监听到文件的变化后（也就是代码变更），会重新编译，并存在内存里，这样快，用的 `memory-fs`。
    4. 编译结束后，WDS会通过socket把编译后生成的新的 hash 值发送，然后又会发送一个 type 为 ok 的信息。
    5. `webpack-dev-server/client/index.js` 当收到了 ok 的消息后，执行 `reloadApp`
    6. 执行`reloadApp`时，如果没有配置hot，就直接执行`location.reload`刷新页面， 如果配置了，发送一个消息`webpackHotUpdate`出去，并带上 hash 值， 这个js的任务完成。
        ```js
        function reloadApp() {
            // ...
            if (hot) {
                const hotEmitter = require('webpack/hot/emitter');
                hotEmitter.emit('webpackHotUpdate', currentHash);
                // ...
            } else {
                self.location.reload();
            }
        }
        ```
    7. 准备热更新并没有直接检查更新，为了职责明确，把事情移交给 `webpack/hot/dev-server.js` 来做。
    8. `webpack/hot/dev-server.js` 里是监听 `webpackHotUpdate` 消息的，收到了`hash` 后会去调用`webpack/lib/HotModuleReplacement.runtime（简称 HMR runtime）（终于上场了了）`中的 `check` 方法，检测是否有新的更新
    9. 在 check 过程中会利用 webpack/lib/JsonpMainTemplate.runtime（简称 jsonp runtime）中的两个方法 hotDownloadManifest和hotDownloadUpdateChunk

    10. 利用上一次保存的 hash 值，调用 `hotDownloadManifest` 发送xxx/hash.hot-update.json的ajax请求

    ![tu](https://user-gold-cdn.xitu.io/2019/12/1/16ec04289af752da?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

    返回的结果中，h代表本次新生成的Hash值，用于下次文件热更新请求的前缀。c表示当前要热更新的文件对应的是index模块。

    11. 然后通过调用 `hotDownloadUpdateChunk` 方法，通过 jsonp 请求最新的模块代码形式，请求 `xxx/hash.hot-update.js` 文件，得到本次改动的文件代码

    ![tu2](https://user-gold-cdn.xitu.io/2019/12/1/16ec04316d6ac5e3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

    12. 通过调用 `hotApply` 进行代码替换。 `hotApply` 做的事情就是删除过期的模块，就是需要替换的模块，然后添加新的模块

    完整的流程图如下

    ![tutu](https://pic1.zhimg.com/80/v2-f7139f8763b996ebfa28486e160f6378_1440w.jpg)
9. 为什么更新模块的代码不直接在第三步通过 websocket 发送到浏览器端，而是通过 jsonp 来获取呢？

    我的理解是，功能块的解耦，各个模块各司其职，`dev-server/client` 只负责消息的传递而不负责新模块的获取
    
    而这些工作应该有 HMR runtime 来完成，HMR runtime 才应该是获取新代码的地方。
    
    再就是因为不使用 `webpack-dev-server` 的前提，使用 `webpack-hot-middleware` 和 `webpack` 配合也可以完成模块热更新流程，在使用 `webpack-hot-middleware` 中有件有意思的事，它没有使用 `websocket`，而是使用的 `EventSource`。
    
    综上所述，HMR 的工作流中，不应该把新模块代码放在 websocket 消息中。