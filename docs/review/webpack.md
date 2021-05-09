[优质链接](https://juejin.cn/post/6844904094281236487)

[一文读懂webpack核心原理](https://juejin.cn/post/6949040393165996040)

[mini-babel](https://github.com/jamiebuilds/the-super-tiny-compiler)

1. Webpack 的运行流程

    webpack 流程是一个串行的过程, 从启动到结束会依次执行以下流程 :

    1. 启动，通过命令行，比如`npm run build`， 会执行对应的命令，然后找 `webpack`，从 `node_modules/.bin` 目录开始查找，最后再 `node_modules\webpack\bin\webpack.js` 找到，然后开始执行这个 js，找到 `webpack-cli/webpack-command` 这个 npm 包，然后执行 cli
    2. 初始化参数：从配置文件和`Shell`语句中读取与合并参数,得出最终的参数。
    3. 开始编译：用上一步得到的参数初始化`Compiler`对象`compiler = webpack(options)`, 加载所有配置的插件,执行对象的`run`方法开始执行编译。
    4. 确定入口：根据配置中的`entry`找出所有的入口文件。
    5. 编译模块：从入口文件出发,调用所有配置的`Loader`对模块进行翻译,再找出该模块依赖的模块,再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
    6. 完成模块编译：在经过第 4 步使用`Loader`翻译完所有模块后,得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
    7. 输出资源：根据入口和模块之间的依赖关系, 组装成一个个包含多个模块的 Chunk,再把每个`Chunk`转换成一个单独的文件加入到输出列表,这步是可以修改输出内容的最后机会。
    8. 输出完成：在确定好输出内容后,根据配置确定输出的路径和文件名,把文件内容写入到文件系统。

    在以上过程中,`Webpack`会在特定的时间点广播出特定的事件, 插件在监听到感兴趣的事件后会执行特定的逻辑, 并且插件可以调用`Webpack`提供的`API`改变`Webpack`的运行结果。

2. webpack 需要注意的点

    1. npm install webpack webpack-cli -D（大写是当道 devDepends 里的，小写就直接放依赖里了）
    2. npx webpack --mode=development，这里看下，为啥用 npx，因为以前 npm 装 webpack 等命令行工具都要-g 的，污染全局

        用了 npx 后，它会去自动找到本地项目下的命令。webpack 默认打包的话，是不会打包没有引用的 js 文件的。import 后是可以的

    3. 安装 `babel-loader` 并配置。装了 babel 后还要配置 babel，就是要装 `babel/preset-env（转译代码）`, `plugin-transform-runtime`（ 用了这个可以节省很多重复的代码，）`runtime-corejs`（配置 useBuiltIns 的时候必须要有 corejs3（不然会默认使用 2, 会有些实例还是需要额外的 polyfill），可以用来按需引用转译模块）useBuiltIns 是用于 polyfill 的，这个是 env 里带的
    4. 插件的执行顺序是从前往后，preset 预设的执行顺讯是从后往前，插件在预设前运行, 预设其实就是插件的组合包。
    5. @babel/runtime 和 corejs 因为跑起来的时候需要用到他们，所以他们要作为生产依赖安装。
    6. webpack.config.js 里使用 mode: 'development' ，可以在代码中通过 process.env.NODE_ENV 获取，就是我们常见的配置开发或者是生产环境。实际上，webpack 打包后的文件里,process.env.NODE_ENV 会被打包成'development'字符串。
    7. 使用 html-webpack-plugin 插件可以让 html 自动引入 js 文件，并且利用它的配置的话也是可以定制化呈现 html，方便不同渠道的业务。
    8. 想让它跑起来后，这个时候 console 的话，会映射到打包后的代码，如果想让他映射到原来的代码的话，因此，综合构建速度 - 开发环境推荐： `cheap-module-eval-source-map` - 生产环境推荐： `cheap-module-source-map`
       但是我通常排查错误的方式是直接代理一下，除了编译错误，其它的一下就能找到错误的位置明细了。

    9. 想让 css 跑起来的话，要装不少插件 style-loader （动态创建 style 标签，将 css 插入到 head 中.）less-loader css-loader（负责处理 @import 等语句） postcss-loader(兼容) autoprefixer。loader 执行顺序是从右往左的。
    10. 当然，loader 其实还有一个参数，可以修改优先级，enforce 参数，其值可以为: pre(优先执行) 或 post (滞后执行)。
    11. url-loader 配置可以读文件，背景图片，大小限制，小于限制的变 dataUrl
    12. 处理 html 上的本地图片，需要安装 html-withimg-loader 插件,但是这样的话，之前的 html 模板语言就不能用了
    13. 配置 output 时，有一个 publickPath: '/'，直接就是根目录，配置成'/truck/', `http://localhost:3000/truck/` 就是默认的 indexhtml 展示的位子。build 完了后，资源会变成'./truck/xxxx'；
    14. 使用 clean-webpack-plugin 可以清空每次 dist 文件，防止 bundle 太多找不到.
    15. .babelrc 的配置，会优先 webpack.config 里的配置。
    16. 像浏览器的配置，可以放.browserslistrc 文件里，更清晰，而且可以多个 loader 共享使用
    17. 我要是想用 react，需要安装 react 的 babel 预设，在 babelrc 里添加， 同时 webpack 配置里要加一个

        ```js
        resolve: {
            extensions: ['.js', '.jsx', '.json'];
        }
        ```

        这样我的 jsx 文件就不需要写全称了。

    18. 安装`@babel/plugin-proposal-class-properties` 才可以在类里用箭头函数。
    19. 在 output 设置里，chunkFilename:'[name].js'可以把文件实际化，不然就是 id.js 了
    20. webpack 的 resolve 配置很有用，可以里面配 `modules: [path.resolve(__dirname, 'node_modules')]`, 这样可以不用引路径
    21. 可以加 `extenstion`，这样不用写.jsx，它会默认从左往右查，所以使用频率最高的放前面。
    22. 还可以设置别名 `alias: {'react-native': '@my/react-native-web' //这个包名是我随便写的哈}` ，这样代码里就直接引入 react-native 而不是后者
    23. `DefinePlugin` 配合`dotenv`这个库，可以在.env 里写环境变量，webpack 首行直接 require('ditenv').config();这些环境变量就被打到了 process.env 里了。然后利用`.env.vm`，和服务器交互即可。可以利用它们，来做符合自己业务不同的环境
    24. exculde 优先级是高于`include`的
    25. 使用 `cache-loader` 或者是 `babel-loader` 下参数`cacheDirectory`设置为 true，可以让它在构建的过程尝试读取缓存，提高编译时间。
    26. 使用 `HappyPack` 插件/ `thread-loader` 让`webpack`在构建的时候可以同时处理多个子线程/进程，提高构建时间。
    27. 如果使用了不需要构建的第三方依赖，如`Jquery`或者是 loadsh,可以用 module: { noParse: /jquery|loadsh/ } 来搞定。
    28. 如果使用了第三方的包的时候，自己的代码需要用到 `import $ from 'jquery'`，可以配置 externals: { 'jquery': 'jQuery'} ,这样全局就会有 jQuery 变量了。
    29. webpack 自己会有 `tree-shaking` 功能，没有 import 的代码它不会打包出来。
    30. 使用 `scope hosting`，可以自动省略不必要的代码。比如只写了 `let a = 1;let b = 2;let c = a+b;console.log(c);`它会直接打包成 console.log(3);前面的都没了。而这个本身实际上是把多个模块的包裹函数，尽可能的变成一个。

3. webpack 按需加载是怎么做到的？

    ```js
    import('./handle').then(fn => {
        const sum = fn.sum;
        console.log(sum(3, 5));
    });
    import('./handle').then(res => res.default);
    // res.default 就是那个组件
    ```

    可以做到按需加载，在执行到这段代码后才会加载，已经替代掉 `require.ensure` 了。

    `import()` 只是一个语法糖，当前模块没有加载时，懒加载会给 `window.webpackJsonp` 这个数组 push 进去，内部会发起一个 `JSONP` 请求来加载目标代码模块， 返回值是一个 `Promise` 对象，可以在 `then` 方法内得到真正的模块。

    同时，需要配合 babel 的插件 `@babel/plugin-syntax-dynamic-import` 来使用。

4. webpack 的 tree-shaking 原理是什么

    首先，它是依托于 es6 modules 才能完成，因为 esm 的依赖关系是确认的，和运行时无关，是编译时就确定的。正因为如此，它才能做 tree-shaking
    而 tree-shaking 呢，就是在转换 AST 的时候，把死路径给摇掉，现在都是 UglifyJSPlugin 来完成 js 的 dce

5. 什么是 DCE(dead code elimination) 消除死代码?

    - 代码不会被执行，不可到达，比如使用了 if(false)
    - 代码的执行结果没有使用，就没有引用。
    - 代码只会影响死变量，只写不读

6. Loader 和 Plugin 的区别

    - Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。因为 `Webpack` 只认识 JavaScript，所以 `Loader` 就成了翻译官，对其他类型的资源进行转译的预处理工作。
    - `Plugin` 就是插件，基于事件流框架 Tapable，插件可以扩展 `Webpack` 的功能，在 `Webpack` 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 `Webpack` 提供的 `API` 改变输出结果。
    - `Loader` 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性。
    - `Plugin` 在 `plugins` 中单独配置，类型为数组，每一项是一个 `Plugin` 的实例，参数都通过构造函数传入。

7. 如何写一个自定义的 loader？

    第一个参数 `source` 就是文件内容，然后你该替换替换

    缓存`this.cacheable();`

    最后`this.callback(null, content, inputSourceMap);`

    参考[core-loader](https://zhenglin.vip/js/core-loader.js)

    如果是个异步的 `loader` 的话，是`const callback = this.async();`

    异步执行完调用 `callback(null, output);`

8. 常用的几个插件

    1. 通过 MiniCssExtractPlugin 来生成单独的 css 文件， 所以这个是和 style-loader 是冲突的，因为 style-loader 是把 css 文件插到 html 里的，要改用 MiniCssExtractPlugin.loader
    2. HtmlWebpackPlugin 简化了 HTML 文件的创建， 同时也可以压缩 HTML
    3. 使用 CssMinimizerWebpackPlugin 来压缩 css 文件
    4. 使用 cleanWebpackPlugin 来清理 dist 文件
    5. 使用 postcss-loader 以及 autoprefixer 插件来完成 css3 的前缀补全
    6. 多页面打包，利用 glob 来获取对应路径下的所有入口，再写个函数，生成 entry 和 plugins（htmlwebpackplugins）

        ```js
        const setMPA = () => {
            const entry = {};
            const htmlWebpackPlugins = [];
            const entryFiles = glob.sync(
                path.join(__dirname, './src/*/index.js')
            );

            Object.keys(entryFiles).map(index => {
                const entryFile = entryFiles[index];
                let match = entryFiles[index].match(/src\/(.*)\/index.js/);
                let pageName = match && match[1];

                entry[pageName] = entryFile;
                htmlWebpackPlugins.push(
                    new HtmlWebpackPlugin({
                        template: path.join(
                            __dirname,
                            `src/${pageName}/index.html`
                        ),
                        filename: `${pageName}.html`,
                        chunks: ['vendors', pageName],
                        inject: true,
                        minify: {
                            html5: true,
                            collapseWhitespace: true,
                            preserveLineBreaks: false,
                            minifyCSS: true,
                            minifyJS: true,
                            removeComments: false,
                        },
                    })
                );
            });
            return {
                entry,
                htmlWebpackPlugins,
            };
        };
        ```

    7. 开发环境上 sourcemap 和补上的区别，就是上了的话，可以直接看自己写的源代码，而如果不上的话，虽然没有压缩，但是看到的是已经转译后的代码，不方便调试。
    8. 利用 splitchuncksPlugin 来分离代码

        默认情况下，它只会影响到**按需加载**的 chunks，因为修改 initial chunks 会影响到项目的 HTML 文件中的脚本标签。

        比如两个入口文件A，和B，它们都引用到了C。那么C肯定是打包两份到对应的文件里了，所以需要有分割操作。

        或者是，比如一个入口文件A，还有一个按需加载文件C，都引用到了D模块，那么D如果多次被引用了，那么就会走splitChunks了。

        webpack 将根据以下条件自动拆分 chunks：

        - 新的 chunk 可以被共享，或者模块来自于 node_modules 文件夹
        - 新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）
        - 当按需加载 chunks 时，并行请求的最大数量小于或等于 30
        - 当加载初始化页面时，并发请求的最大数量小于或等于 30
        - 当尝试满足最后两个条件时，最好使用较大的 chunks。

    9. 使用 friendlyErrorWebpackPlugin 来完成打日志，这样会有颜色告诉你成功信息，stats 同时要设置为 errors-only, 不然输出太干了。
    10. 利用 webpack-merge 来组合配置，比如需要有 webpack.config.base.js， 有 dev,有 Production，然后就要去合并基础的。

        ```js
        module.exports = merge(baseConfig, devConfig);
        ```

    11. 利用内置的 stats 对象来分析基本信息，时间和大小，但是 stats 颗粒度太粗了，所以需要插件来分析。
    12. 利用 `speedMeasureWebpackPlugin` 来观察插件和 Loader 的执行速度。
        通过 module.export = smp.wrap({...})
    13. 使用 `webpackBundleAnalyzer` 来进行体积大小分析，会打开 8888 端口号的一个页面，可以在里面看到图片分析。类似热词图
    14. 使用 `terser-webpack-plugin` 开启 parallel 参数，开启并行压缩，减少构建时间。

        ```js
        module.exports = {
            // 自带的属性，优化属性
            optimization: {
                minimizer: [
                    new TerserPlugin({
                        parallel: 4, // 设为true的话，默认是电脑CPU数量的两倍减去1
                        cache: true, // 提升二次构建速度，和loader的cacheDirectory:true 类似
                    }),
                ],
            },
        };
        ```

    15. 使用 `new HardSourceWebpackPlugin()` 一样可以完成缓存，是针对模块的解析的缓存，提升二次构建速度,几种缓存都会放到 `node_modules` 下的 `.cache` 目录下。
    16. 使用 `image-webpack-loader` 直接对图片压缩，可以试验一下。

        ```js
        {
            loader: 'image-webpack-loader',
            options: {
                mozjpeg: {
                    progressive: true,
                    quality: 65
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                    enabled: false,
                },
                pngquant: {
                    quality: '65-90',
                    speed: 4
                },
                gifsicle: {
                    interlaced: false,
                },
                // the webp option will enable WEBP
                webp: {
                    quality: 75
                }
            }
        }
        ```

    17. 使用 `PurgecssPlugin` 擦除没用到的 css

9. HappyPack / thread-loader 原理是什么？

    默认的情况下，webpack 是一个进程，也就是一个 webpack，由 webpack 本身去解析模块，那么有了 happypack 后呢，在 webpack 的 compiler 实例 run 的时候，先解析 happypack plugin,然后 happypack 创建线程池子，然后线程池将构建任务分配给各个线程。每个线程都会去处理模块，处理完了后通过一个自己的通信方式，把信息传回 happypack 主进程。

    ```js
    1. 替换需要的loader为 use: 'happypack/loader?id=jsx'
    2.
    export.plugins = [
        new HappyPack({
            id: 'jsx',
            threads: 4,
            loaders: ['babel-loader']
        })
    ]
    // 默认会开3个，如果不配的话。
    // 相当于一个happypack分配了4个线程给 babel-loader, 快速处理jsx
    // id的话是给多个happypack用的，如果只有一个，也不需要配置。
    ```

    但是 webpack3 才使用，webpack4 后就不用了，使用 `thread-loader` 来替换，原理是类似的。是分配 node 的多进程来做到的。

    ```js
    rules: [
        {
            test: /.js$/,
            use: [
                {
                    loader: 'thread-loader',
                    options: {
                        workers: 3,
                    },
                },
                'babel-loader',
            ],
        },
    ];
    ```

    性能的话看起来好像 `thread-loader` 好一点点，而且配置简单，使用容易一点，直接在要开的 loader 上面添加即可。

10. 如何使用 `DLLPlugin` 来完成分包呢？

    这个插件是在一个额外的独立的 webpack 设置中创建一个只有 dll 的 bundle(dll-only-bundle)。 这个插件会生成一个名为 `manifest.json` 的文件，这个文件是用来让 `DLLReferencePlugin` 映射到相关的依赖上去的。

    弄一个新的 webpack.dll.js 文件

    ```js
    module.exports = {
        entry: {
            library: ['react', 'react-dom'],
        },
        output: {
            filename: '[name]_[hash].dll.js', // 不能使用chunkhash/contenthash
            path: path.join(__dirname, 'build/library'),
            library: '[name]_[hash]',
        },
        plugins: [
            // 内置的插件
            new webpack.DllPlugin({
                name: '[name]_[hash]',
                path: path.join(__dirname, 'build/library/[name].json'),
            }),
        ],
    };
    ```

    这样会生成 xx.json 文件。

    然后在正式的配置里，通过

    ```js
    new webpack.DllReferencePlugin({
        manifest: require('./build/library/library.json')
    }),
    // 需要 AddAssetHtmlPlugin 这个插件
    new AddAssetHtmlPlugin({
        filepath: path.resolve(__dirname, 'build/library/*.dll.js'),
    }),
    ```

    这样的话，就会自动把对应的 js，插到 html 里，从而完成分包。

11. 如何写一个自定义 `plugin` ？

    其实就是利用 this.hooks.的生命周期来做事情，比如

    ```js
    this.hooks.done.tap('done', stats => {
        console.log(stats.compilation.error);
    });
    // 用来打日志，this 就是 compiler 对象

    // 比如
    class xxxPlugin {
        apply(compiler) {
            compiler.hooks.beforeRun.tap('xxxPlugin', compiler => {
                // ... do sth.
            });
        }
    }
    ```

    具体的 tap 里的参数，需要去看 hooks 里的具体参数，有的是 compiler，有的是 compilation，有的又是 stats， 看下面就知道

12. compiler 是什么？

    [源码位子](https://github.com/webpack/webpack/blob/master/lib/Compiler.js)

    compiler 是继承自 Tapable 的一个类，初始化的时候会 new 一个 compiler 实例。

    compiler 实例下有多个 hook,在 constructor 下会声明

    ```js
    this.hooks = Object.freeze({
        initialize: new SyncHook([]),
        shouldEmit: new SyncBailHook(['compilation']),
        done: new AsyncSeriesHook(['stats']),
        afterDone: new SyncHook(['stats']),
        additionalPass: new AsyncSeriesHook([]),
        beforeRun: new AsyncSeriesHook(['compiler']),
        run: new AsyncSeriesHook(['compiler']),
        emit: new AsyncSeriesHook(['compilation']),
        assetEmitted: new AsyncSeriesHook(['file', 'info']),
        afterEmit: new AsyncSeriesHook(['compilation']),
        thisCompilation: new SyncHook(['compilation', 'params']),
        compilation: new SyncHook(['compilation', 'params']),
        normalModuleFactory: new SyncHook(['normalModuleFactory']),
        contextModuleFactory: new SyncHook(['contextModuleFactory']),
        beforeCompile: new AsyncSeriesHook(['params']),
        compile: new SyncHook(['params']),
        make: new AsyncParallelHook(['compilation']),
        finishMake: new AsyncSeriesHook(['compilation']),
        afterCompile: new AsyncSeriesHook(['compilation']),
        watchRun: new AsyncSeriesHook(['compiler']),
        failed: new SyncHook(['error']),
        invalid: new SyncHook(['filename', 'changeTime']),
        watchClose: new SyncHook([]),
        shutdown: new AsyncSeriesHook([]),
        infrastructureLog: new SyncBailHook(['origin', 'type', 'args']),
        environment: new SyncHook([]),
        afterEnvironment: new SyncHook([]),
        afterPlugins: new SyncHook(['compiler']),
        afterResolvers: new SyncHook(['compiler']),
        entryOption: new SyncBailHook(['context', 'entry']),
    });
    ```

    其实多数都是同步的钩子，然后使用的时候，比如上面的 done 吧，就是

    ```js
    compiler.hooks.done.tap('xxxx', () => {
        // dosth
    });
    ```

    而 compiler 类里，会在合适的阶段去执行 this.hooks.xxx.call('');

    然后在 run 的时候，去检查 config.js 下的 plugins，然后通过 for of 挨个 apply(compiler) 即可注册进去。

13. compilation 是什么？

    compilation 也是集成自 Tapable 的一个类。

    它上面也有多个 hooks，主要是偏内置的。负责模块的编译打包和优化的一个过程。

    在 compiler 的一些 hooks 里会调用 compilation 的一些生命周期方法

    Compiler 是每次 Webpack 全部生命周期的对象，而 Compilation 是 Webpack 中每次构建过程的生命周期对象，Compilation 是通过 Compiler 创建的实例。两个类都有自己生命周期，即有自己不同的 Hook，通过添加对应 Hook 事件，可以拿到各自生命周期关键数据和对象。Compilation 有个很重要的对象是 Stats 对象，通过这个对象可以得到 Webpack 打包后的所有 module、chunk 和 assets 信息，通过分析 Stats 对象可以得到很多有用的信息，比如 webpack-bundle-analyzer 这类分析打包结果的插件都是通过分析 Stats 对象来得到分析报告的。

14. Tapable 是什么？

    类似于 `node` 中的 `eventEmmiter` 的发布订阅模块，所以 `webpack` 本质就是基于事件流的编程范例，一些列的插件运行。

    它控制钩子函数的发布与订阅，控制着 `webpack` 的插件系统，它暴露了很多 `HOOK` 类，为插件提供挂载的钩子。

    ```js
    const {
        SyncHook,
        SyncBailHook,
        SyncWaterHook,
        SyncLoopHook,
        AsyncParallelHook,
        AsyncParallelBailHook,
        AsyncSeriesHook,
        AsyncSeriesBailHook,
        AsyncSeriesWaterHook,
    } = require('tapable')
    waterfall = 同步方法，会传值给下一个函数。
    Bail = 是当函数有返回值，在当前执行函数会停止。
    Loop = 监听函数返回true代表继续，返回undefined代表结束
    ```

    使用方式通常就是

    ```js
    const hook1 = new SyncHook(['arg1', 'agr2', 'arg3']);
    hook1.tap('hook1', (a, b, c) => console.log(a, b, c)); // 1,2,3
    hook1.call(1, 2, 3);
    // 这个tap类似于On
    // 这个call类似于trigger
    ```

15. 如何使用 `husky` 来做到 `precommit` 管控
16. 如何开启 gzip? 如何 localhost 代理访问开发接口？

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

17. 文件监听原理是什么

    轮训判断文件的最后编辑事件是否有变化，当某个文件发生变化的时候，并不会立马告诉监听者，而是先缓存起来，等到 `aggregateTimeout` 后才通知。默认是 300ms

    ```js
    module.exports = {
        watch: true,
        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 300, //文件变动后多久发起构建，越大越好
            poll: 1000, //每秒询问次数，越小越好
        },
    };
    ```

18. 文件指纹几种的区别是什么？

    ```js
    // hash: 8， 这个8代指前8位hash
    filename: '[name][hash:8].js',
    filename: '[name][chunkhash:8].js',
    filename: '[name][contenthash:8].js',
    ```

    有 hash 指纹，有 chunkhash，有 contenthash。

    其实颗粒度就是由粗到细，变化等级由高到低。

    比如有一个多入口文件，只修改了其中一个文件，如果是用的 hash，就会造成修改一个文件，导致另外一个文件跟着变化，而另外的文件并没有修改啊，所以不合理，需要改用 chunkhash，一个入口一个模块，一个 chunkhash。

    `output.chunkFileName`

    那么如果用了 chunkhash，如果你用了 css，css 也用了 chunkhash，由于一个入口引用到了，如果没改 css，而改了入口中其它 js,一样会导致变化，所以 css 要用 contenthash

    所以单入口单出口，出口用 hash 和 chunkhash 是一样的。

    而图片文件的那个 hash，是直接 md5 的，是自己单独的策略，和别人无关

    开发环境都用 hash，不然因为持久缓存，反而增加编译时间，影响热更新的使用。

19. 如何去配置一个可配置的环境变量？

    1. 首先，使用`dotenv`这个库，`require('dotenv').config()`
    2. 创建 .env 文件，在里面写我要定的全局变量，比如各种不同环境下会出的地址，当然是本地或者是开发环境的
    3. 使用 `DefinePlugin` 这个插件，把对应的这些 process.env 都收敛起来。
    4. 然后创建 .env.vm 文件，指向是`REACT_APP_CACHE_URL="${cache_url}"`
    5. 创建 auto-config.xml 文件

        ```js
        <?xml version="1.0" encoding="UTF-8"?>
            <config>
            <group>
                <property name="homepage_url" />
                <property name="cache_url" />
            </group>
            <script>
                <generate template=".env.vm" destfile=".env" charset="UTF-8"/>
                <generate template="package.json.vm" destfile="package.json" charset="UTF-8"/>
            </script>
        </config>s
        ```

    6. 最后再后台配置 autoconfig,也就是对应变量的值，从而完成整体配置。

20. `webpack` 热更新原理
    [参考 1](https://zhuanlan.zhihu.com/p/30669007)
    [参考 2](https://juejin.cn/post/6844904008432222215)

    早期的 `webpack` 确实是个 `SSE` 协议，后来才改的 WS

    总结版：

    客户端从服务端拉去更新后的文件，准确的说是 chunk diff (chunk 需要更新的部分)，实际上 `WDS` 与客户端之间维护了一个 Websocket，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 `WDS` 发起 `Ajax` 请求来获取更改内容(文件列表、hash)，这样客户端就可以再借助这些信息继续向 `WDS` 发起 `jsonp` 请求获取该 `chunk` 的增量更新。最后由 `hotApply` 方法执行更新

    `Hash` 值代表每一次编译的标识。

    它会埋两个 `js` 作为入口的平级

    1. `webpack-dev-server/client/index.js` 用于 `webSocket` 通信，因为我启动的是本地服务，然后客户端要和我通信，就要有代码，所以偷偷埋一个，用来通信
    2. 一个是 `webpack/hot/dev-server.js` 用于检查更新逻辑。

    过程：

    1. `webpack-dev-server` 跑起来后，会生成一个 `compiler` 实例，启动 server，并且启动 `websocket` 服务

    2. `webpack-dev-middleware` 调用 `compiler.watch` 方法，这个方法做两件事

        1. 首先对本地文件代码进行编译打包，也就是 `webpack` 的一系列编译流程。

        2. 其次编译结束后，开启对本地文件的监听，当文件发生变化，重新编译，编译完成之后继续监听。

        内部可能会是用 `fs.watch | fs.watchFile` 来监听的。

    3. 当我监听到文件的变化后（也就是代码变更），会重新编译，并存在内存里，这样快，用的 `memory-fs`。
    4. 编译结束后，WDS 会通过 `socket` 把编译后生成的新的 `hash` 值,然后发送一个 Type hash 的消息，然后又会发送一个 type 为 ok 的信息。
    5. `webpack-dev-server/client/index.js` 当收到了 ok 的消息后，执行 `reloadApp`
    6. 执行`reloadApp`时，如果没有配置 hot，就直接执行`location.reload`刷新页面， 如果配置了，发送一个消息`webpackHotUpdate`出去，并带上 hash 值， 这个 js 的任务完成。

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
    9. 在 check 过程中会利用 webpack/lib/JsonpMainTemplate.runtime（简称 jsonp runtime）中的两个方法 hotDownloadManifest 和 hotDownloadUpdateChunk

    10. 利用上一次保存的 hash 值，调用 `hotDownloadManifest` 发送 xxx/hash.hot-update.json 的 ajax 请求

        ![tu](https://user-gold-cdn.xitu.io/2019/12/1/16ec04289af752da?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

        返回的结果中，h 代表本次新生成的 Hash 值，用于下次文件热更新请求的前缀。c 表示当前要热更新的文件对应的是 index 模块。

    11. 然后通过调用 `hotDownloadUpdateChunk` 方法，通过 jsonp 请求最新的模块代码形式，请求 `xxx/hash.hot-update.js` 文件，得到本次改动的文件代码

        ![tu2](https://user-gold-cdn.xitu.io/2019/12/1/16ec04316d6ac5e3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

    12. 通过调用 `hotApply` 进行代码替换。 `hotApply` 做的事情就是删除过期的模块，就是需要替换的模块，然后添加新的模块

    完整的流程图如下

    ![tutu](https://pic1.zhimg.com/80/v2-f7139f8763b996ebfa28486e160f6378_1440w.jpg)

21. 为什么更新模块的代码不直接在第三步通过 websocket 发送到浏览器端，而是通过 jsonp 来获取呢？

    我的理解是，功能块的解耦，各个模块各司其职，`dev-server/client` 只负责消息的传递而不负责新模块的获取

    而这些工作应该有 HMR runtime 来完成，HMR runtime 才应该是获取新代码的地方。

    再就是因为不使用 `webpack-dev-server` 的前提，使用 `webpack-hot-middleware` 和 `webpack` 配合也可以完成模块热更新流程，在使用 `webpack-hot-middleware` 中有件有意思的事，它没有使用 `websocket`，而是使用的 `EventSource`。

    综上所述，HMR 的工作流中，不应该把新模块代码放在 websocket 消息中。
