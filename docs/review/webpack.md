[优质链接](https://juejin.cn/post/6844904094281236487)

[一文读懂 webpack 核心原理](https://juejin.cn/post/6949040393165996040)

[mini-babel](https://github.com/jamiebuilds/the-super-tiny-compiler)

1. Webpack 的运行流程
    <details open>

    webpack 流程是一个串行的过程, 从启动到结束会依次执行以下流程 :

    1. **启动**，通过命令行，比如`npm run build`， 会执行对应的命令，然后找 `webpack`，从 `node_modules/.bin` 目录开始查找，最后再 `node_modules\webpack\bin\webpack.js` 找到，然后开始执行这个 js，找到 `webpack-cli/webpack-command` 这个 npm 包，然后执行 cli

    2. **初始化**
       Webpack 读取配置文件（如 webpack.config.js），合并**命令行**参数，生成最终的配置对象。根据配置初始化 Compiler 对象。得到 `compiler = webpack(options)`

    3. **编译**
       Compiler 对象开始工作，调用配置中的插件的 apply 方法，注册各种钩子事件。然后从入口文件出发，调用所有配置的`Loader`对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。

        **加载所有配置的插件**[源码位置](https://github.com/webpack/webpack/blob/master/lib/webpack.js#L69)

        ```js
        if (Array.isArray(options.plugins)) {
            for (const plugin of options.plugins) {
                if (typeof plugin === 'function') {
                    plugin.call(compiler, compiler);
                } else {
                    plugin.apply(compiler);
                }
            }
        }
        ```

    4. **构建依赖图**
       上一步完成后，就得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。

    5. **生成输出文件**
       根据入口和模块之间的依赖关系, 组装成一个个包含多个模块的 Chunk,再把每个`Chunk`转换成一个单独的文件加入到输出列表,这步是可以修改输出内容的最后机会。在确定好输出内容后,根据配置确定输出的路径和文件名,把文件内容写入到文件系统。

    6. **完成**
       Webpack 触发 done 钩子，表示整个构建流程结束。

    总结来说，Webpack 的运行流程是一个从初始化到输出的完整构建过程，核心是模块的解析、转换和打包。
    在以上过程中,`Webpack`会在特定的时间点广播出特定的事件, 插件在监听到感兴趣的事件后会执行特定的逻辑, 并且插件可以调用`Webpack`提供的`API`改变`Webpack`的运行结果。

2. webpack 按需加载是怎么做到的？
    <details open>

    早期的 Webpack 使用 require.ensure 实现按需加载，但现在已经被 import() 取代。

    ```js
    import('./handle').then((fn) => {
        const sum = fn.sum;
        console.log(sum(3, 5));
    });
    import('./handle').then((res) => res.default);
    // res.default 就是那个组件
    ```

    import() 只是一个语法糖，当前模块没有加载时，懒加载的文件会 push 进 window.webpackJsonp 这个数组 里，而当运行到这里是，内部会发起一个 JSONP 请求来加载目标模块 chunk 文件，加载完成后，会返回一个 Promise 对象，所以在 then 里就可以直接使用模块内容。

    并且，动态导入需要配合 babel 插件 `@babel/plugin-syntax-dynamic-import` 来使用以支持 import 的语法

3. webpack 的 tree-shaking 原理是什么
    <details open>

    tree-shaking 核心原理基于 ES6 modules 才能完成，因为 ESM 的依赖关系是确认的，和运行时无关，是编译时就确定的。正因为如此，Webpack 可以通过静态分析，确定 module 中哪些导出的函数或变量被使用。
    而 tree-shaking 呢，就是在转换 AST 的时候，把死路径给摇掉。

    1. 静态分析，Webpack 在构建时会分析模块的依赖关系，标记哪些导出是未使用的。
    2. 标记未使用的代码，Webpack 不会直接移除未使用的代码，而是通过标记（如 \/\* unused export \*\/）来标识。
    3. 代码压缩, 在生产模式下，Webpack 会使用压缩工具（如 Terser）移除标记为未使用的代码

4. 什么是 DCE(dead code elimination) 消除死代码?
    <details open>

    1. 代码不会被执行，不可到达，比如使用了 if(false)
    2. 代码的执行结果没有使用，就没有引用。
    3. 代码只会影响死变量，只写不读

5. Loader 和 Plugin 的区别

    <details open>

    - Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。因为 `Webpack` 只认识 JavaScript，所以 `Loader` 就成了翻译官，对其他类型的资源进行转译的预处理工作。
    - `Plugin` 就是插件，基于事件流框架 Tapable，插件可以扩展 `Webpack` 的功能，在 `Webpack` 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 `Webpack` 提供的 `API` 改变输出结果。
    - `Loader` 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性。
    - `Plugin` 在 `plugins` 中单独配置，类型为数组，每一项是一个 `Plugin` 的实例，参数都通过构造函数传入。
    - 一般来说，如果你需要对单个文件进行内容转换时，优先使用 Loader，但是当你需要针对多个文件进行整合或者是生成个新的文件等，Plugin 就会更适合一些。

6. 如何写一个自定义的 loader？
    <details open>

    Loader 本质上是一个函数，接收文件内容作为参数，返回处理后的内容。所以就是一个 fuction，第一个参数是 source，你就可以针对源文件做文章了。

    ```js
    module.exports = function (source, inputSourceMap) {
        // 启用缓存，启用缓存后，下次再跑就不会再执行这个loader，只要文件内容没变。
        this.cacheable();

        // 替换逻辑：将 $xx 替换为 window.core.xx
        const content = source.replace(/\$(\w+)/g, 'window.core.$1');

        this.callback(null, content, inputSourceMap);
    };
    ```

    如果是个异步 loader 的话,callback 是需要通过 this.async 调用的

    ```js
    module.exports = function (source, inputSourceMap, meta) {
        // 启用缓存
        this.cacheable();

        // 异步处理
        const callback = this.async();

        // 模拟异步操作
        setTimeout(() => {
            const result = source.replace(/\$(\w+)/g, 'window.core.$1');
            callback(null, result, inputSourceMap, meta);
        }, 1000);
    };
    ```

    参考[core-loader](https://zhenglin.vip/js/core-loader.js)，这个插件的目的是由于原来的代码是微前端，各种依赖都在基座里，而引用的时候都是正常的引用，实际上是找不到的，所以需要通过 loader 做一层转换。

7. 如何写一个自定义的插件？

    <details open>

    1. 创建插件类，插件本质上是一个类，类中需要实现 apply 方法。
    2. 使用 Webpack 的钩子，在 apply 方法中，通过 Compiler 或 Compilation 对象，注册 Webpack 的钩子事件。
    3. 实现功能，在钩子中编写具体的逻辑，完成插件的功能。
    4. 导出插件，将插件类导出，供 Webpack 配置使用。以下是一个生成打包文件大小的插件：

    ```js
    const fs = require('fs');
    const path = require('path');

    class FileSizeReportPlugin {
        constructor(options) {
            this.options = options || {};
            this.filename = this.options.filename || 'file-size-report.json';
        }

        apply(compiler) {
            compiler.hooks.emit.tapAsync(
                'FileSizeReportPlugin',
                (compilation, callback) => {
                    const report = {};

                    // 遍历所有打包后的文件
                    for (const filename in compilation.assets) {
                        const size = compilation.assets[filename].size();
                        report[filename] = `${(size / 1024).toFixed(2)} KB`; // 转换为 KB
                    }

                    // 将报告写入到输出目录
                    const outputPath = path.join(
                        compiler.options.output.path,
                        this.filename
                    );
                    fs.writeFile(
                        outputPath,
                        JSON.stringify(report, null, 2),
                        (err) => {
                            if (err) {
                                console.error(
                                    'Error writing file size report:',
                                    err
                                );
                            }
                            callback();
                        }
                    );
                }
            );
        }
    }

    module.exports = FileSizeReportPlugin;

    // webpack.config.js
    const FileSizeReportPlugin = require('./FileSizeReportPlugin');

    module.exports = {
        plugins: [
            new FileSizeReportPlugin({ filename: 'bundle-size-report.json' })
        ]
    };
    ```

8. 如何使用 DLLPlugin 来完成分包呢？

    <details open>

    这个插件是在一个额外的独立的 webpack 设置中创建一个只有 dll 的 bundle(dll-only-bundle)。 这个插件会生成一个名为 `manifest.json` 的文件，这个文件是用来让 `DLLReferencePlugin` 映射到相关的依赖上去的。

    弄一个新的 webpack.dll.js 文件

    ```js
    module.exports = {
        entry: {
            library: ['react', 'react-dom']
        },
        output: {
            filename: '[name]_[hash].dll.js', // 不能使用chunkhash/contenthash
            path: path.join(__dirname, 'build/library'),
            library: '[name]_[hash]'
        },
        plugins: [
            // 内置的插件
            new webpack.DllPlugin({
                name: '[name]_[hash]',
                path: path.join(__dirname, 'build/library/[name].json')
            })
        ]
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

9. compiler 是什么？
    <details open>

    [源码位子](https://github.com/webpack/webpack/blob/master/lib/Compiler.js)

    在 Webpack 中，Compiler 是核心对象之一，负责整个构建流程的管理和执行。它是 Webpack 的主引擎，贯穿从初始化到输出的整个生命周期。
    Compiler 的生命周期包括以下主要阶段：

    1. 初始化：Webpack 读取配置文件，创建 Compiler 实例。初始化插件，调用插件的 apply 方法。
    2. 构建：从入口文件开始，递归解析模块依赖。调用 Loader 转换模块内容。
    3. 优化：执行代码优化（如 Tree-Shaking、代码分割等）。
    4. 生成输出：根据依赖图生成最终的打包文件，并写入到输出目录。
    5. 完成：触发 done 钩子，表示构建流程结束。
       活脱脱一个 webpack 执行步骤

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
        entryOption: new SyncBailHook(['context', 'entry'])
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

10. compilation 是什么？
    <details open>

    compilation 也是集成自 Tapable 的一个类。

    它上面也有多个 hooks，主要是偏内置的。负责模块的编译打包和优化的一个过程。

    在 compiler 的一些 hooks 里会调用 compilation 的一些生命周期方法

    Compiler 是 Webpack 全部生命周期的对象，而 Compilation 是 Webpack 中每次构建过程的生命周期对象，Compilation 是通过 Compiler 创建的实例。两个类都有自己生命周期，即有自己不同的 Hook，通过添加对应 Hook 事件，可以拿到各自生命周期关键数据和对象。Compilation 有个很重要的对象是 Stats 对象，通过这个对象可以得到 Webpack 打包后的所有 module、chunk 和 assets 信息，通过分析 Stats 对象可以得到很多有用的信息，比如 webpack-bundle-analyzer 这类分析打包结果的插件都是通过分析 Stats 对象来得到分析报告的。

11. Tapable 是什么？
    <details open>

    类似于 node 中的 eventEmit 的发布订阅模块，所以 webpack 本质就是基于事件流的编程范例。
    它通过 Tapable 提供的钩子系统，将整个构建流程抽象为一系列事件流，插件和 Loader 则通过监听这些事件来扩展和定制 Webpack 的功能。它暴露了很多 Hook 类，为插件提供挂载的钩子。

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
        AsyncSeriesWaterHook
    } = require('tapable');
    // Water = 同步方法，会传值给下一个函数。
    // Bail = 是当函数有返回值，在当前执行函数会停止。
    // Loop = 监听函数返回true代表继续，返回undefined代表结束
    ```

    使用方式通常就是

    ```js
    const hook1 = new SyncHook(['arg1', 'agr2', 'arg3']);
    hook1.tap('hook1', (a, b, c) => console.log(a, b, c)); // 1,2,3
    hook1.call(1, 2, 3);
    // 这个tap类似于On
    // 这个call类似于trigger
    ```

12. 如何使用 husky 来做到 precommit 管控
    <details open>

    husky 的核心原理是通过 Git 的钩子机制拦截操作，并执行自定义脚本，从而实现对 Git 操作的管控。它简化了钩子管理，并与现代开发工具深度集成，提升了开发效率和代码质量。

    1. 当运行 git commit 时，Git 会触发 pre-commit 钩子。
    2. 钩子文件调用 husky.sh 脚本，执行 npx lint-staged。
    3. 如果 lint-staged 检查失败，提交会被阻止。

13. 如何开启 gzip? 如何 localhost 代理访问开发接口？（待废弃）
    <details open>

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

                    /** 比如你要将http://localhost:8080/index/xxx 替换成 http://10.20.30.120:8080/sth/xxx
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

14. webpack 文件监听原理是什么
    <details open>

    Webpack 的文件监听功能基于以下两种机制，首选文件变化通知机制（inotify 或 fsevents），其次轮询机制（Polling）。考虑是因为文件变化的兼容性有些场景不支持，所以还需要轮训兜底。

    1. 轮询机制（Polling）

        - Webpack 定期检查文件的最后修改时间（mtime）。
        - 如果文件的 mtime 发生变化，则认为文件已被修改。
        - 这种方式适用于不支持文件变更通知的文件系统（如某些网络文件系统）。

    2. 文件系统事件

        - Webpack 使用操作系统提供的文件变更通知机制（如 inotify、fsevents 等）。
        - 当文件发生变化时，操作系统会通知 Webpack，Webpack 随即触发重新构建。
        - 这种方式效率更高，适用于本地文件系统。

    所以完整的流程就是

    1. 启动监听，在构建时会记录所有依赖的文件（如入口文件、模块、配置文件等），然后启动监听
    2. 检测文件变化，如果文件发生变化，Webpack 会收到通知（通过 chokidar 或 fs.watch）。然后标记文件已修改
    3. 触发重新构建。只重新构建受影响的模块（增量构建），提高构建效率

    如何配置？

    ```js
    module.exports = {
        watch: true,
        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 300, //文件变动后多久发起构建，越大越好，这样可以先缓存文件变化，不会立马告诉监听者
            poll: 1000 //每秒询问次数，越小越好
        }
    };
    ```

15. 文件指纹几种的区别是什么？
    <details open>

    ```js
    // hash: 8， 这个8代指前8位hash
    filename: '[name][hash:8].js',
    filename: '[name][chunkhash:8].js',
    filename: '[name][contenthash:8].js',
    ```

    有 hash 指纹，有 chunkhash，有 contenthash。

    其实颗粒度就是由粗到细，变化等级由高到低。

    1. hash 指纹，hash 是基于整个构建结果生成的，只要构建结果有变化，整个 hash 值都会变化。所以如果有一个多入口文件，index.js 和 about.js，会输出：

        - dist/index.8f3e2d9a.js
        - dist/about.8f3e2d9a.js

        而这个时候我修改了 abount.js，即使没有修改 index.js，hash 也会变化。因为 hash 是基于整个构建结果生成的。这不是很合理，所以有了 chunkhash

    2. chunkhash 指纹，如果用了 chunkhash，出口文件的指纹会根据每个 chunk 的内容单独生成，那么就是一个入口一个模块，生成一个 chunkhash，这时候修改 index.js 是不会影响 about.js 的 hash 值的

        - dist/index.8f3e2d9a.js
        - dist/about.3a1b2c4d.js

        但是如果你用了一些公共提取出来的文件，那公共文件的修改还是会导致 chunkhash 改变的，所以得用 splitChunks 把公共的拆出来。
        但是如果你的 js 文件引入了 css，css 也用了 chunkhash，这个时候再修改 js 文件，会导致 css 的指纹也发生变更，所以 css 要用 contenthash。主要是 css 是要用 mini-css-extract-plugin 插件来提取的成为独立文件的。如果不提取，直接打包进 js 文件里，就不需要 contenthash 了。

    3. contenthash 指纹, contenthash 是基于文件内容生成的，与 chunk 的变化无关。修改 JS 文件不会影响 CSS 文件的指纹，未修改的 CSS 文件可以继续使用缓存。
    4. 但是单入口单出口，出口用 hash 和 chunkhash 是一样的。因为就一个文件，而图片文件的那个 hash，是直接 md5 的，是自己单独的策略，和别人无关，一般情况下，在开发环境都用 hash，不然因为持久缓存，反而增加编译时间，影响热更新的使用。

16. 如何理解环境变量？
    <details open>

    首先，环境变量的存在是为了提供一种灵活、动态的方式来配置程序的运行环境。它解决了硬编码配置的局限性，并为程序的运行提供了更高的可移植性和安全性。环境变量允许程序在运行时动态调整配置，而无需修改代码。例如：

    - 在开发环境中使用 NODE_ENV=development，而在生产环境中使用 NODE_ENV=production。
    - 根据环境变量切换数据库连接、API 地址等。

    这种动态性使得程序可以轻松适应不同的运行环境。

    正常我们的项目中，假设环境变量比较少，我们可以直接在 package.json 里设置

    ```js
    "scripts": {
        "start": "NODE_ENV=development webpack serve --config webpack.config.js"
    }
    ```

    那如果我们想设置多个环境变量，可以使用`dotenv`这个库。

    1. 创建 `.env` 文件，在里面写我要定的全局变量，当然是本地或者是开发环境的
    2. 然后在你的文件中`require('dotenv')`,可以在这里导出。
    3. 然后多个环境就写`.env.xx`,引用的时候，按下面写就可以多环境配置变量了。

        ```js
        const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
        dotenv.config({ path: envFile });
        ```

    4. 使用 `DefinePlugin` 这个插件，把对应的这些 `process.env` 都收敛起来。这样在编译的时候，就会自动把 process.env.NODE_ENV 替换为 production 或者是 development 了，毕竟浏览器端不认识。
    5. 在 nuxt 中，nuxt.config.js 中配置 env 就可以了，nuxt 默认就是用的 DefinePlugin 把 process.env 替换的为对应的值。
    6. 但是在 serverless 平台的话，我们其实就一个.env 就够了，剩下的靠平台配置，在函数运行的时候，会把环境变量注入进去。
    7. 然后一般我们的代码中，构建时替换的是业务代码，包含业务客户端和业务服务端，而 Node 端代码（koa server）是不替换的，这个是 run server 的时候动态访问的。

    8. 后续是老的，不用看。然后创建 .env.vm 文件，指向是`REACT_APP_CACHE_URL="${cache_url}"`
    9. 创建 auto-config.xml 文件

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

    10. 最后再后台配置 autoconfig,也就是对应变量的值，从而完成整体配置。

17. webpack 热更新原理
    [参考 1](https://zhuanlan.zhihu.com/p/30669007)
    [参考 2](https://juejin.cn/post/6844904008432222215)

    早期的 `webpack` 确实是个 `SSE` 协议，后来才改的 WS

    核心流程

    1. 文件变化：

        - 开发者修改代码后，Webpack 重新编译生成新的模块。
        - Webpack 会生成一个新的 hash，用于标识当前构建版本。

    2. 通知浏览器：

        - Webpack Dev Server 通过 WebSocket 向浏览器发送更新通知。
        - 通知内容包括：当前构建的 hash 和提示浏览器需要检查更新。

    3. 比对 hash 并请求更新信息：

        - 浏览器接收到 WebSocket 消息后，会通过 AJAX 请求获取更新的模块信息。
        - 请求的文件通常是 manifest 文件（如 main.[hash].hot-update.json），其中包含：
            - 哪些模块发生了变化（模块 ID）。
            - 对应的更新文件（如 index.[hash].hot-update.js）。

    4. 获取更新的模块代码：

        - 根据 manifest 文件中的信息，浏览器通过 **JSONP** 请求获取更新的模块代码。
        - 请求的文件通常是增量更新的 chunk 文件（如 index.[hash].hot-update.js）。

    5. 替换模块：

        - Webpack 的 HMR 运行时加载新的模块代码，并替换旧的模块。
        - 如果模块支持热更新（通过 module.hot API），则执行模块的更新逻辑。
        - 如果模块不支持热更新，则触发页面刷新。

    详细的步骤：

    1. 它会埋两个 `js` 作为入口的平级

        - `webpack-dev-server/client/index.js` 用于 `webSocket` 通信，因为我启动的是本地服务，然后客户端要和我通信，就要有代码，所以偷偷埋一个，用来通信
        - 一个是 `webpack/hot/dev-server.js` 用于检查更新逻辑。

    2. `webpack-dev-server` 跑起来后，会生成一个 `compiler` 实例，启动 server，并且启动 `websocket` 服务

    3. `webpack-dev-middleware` 调用 `compiler.watch` 方法，这个方法做两件事

        1. 首先对本地文件代码进行编译打包，也就是 `webpack` 的一系列编译流程。

        2. 其次编译结束后，开启对本地文件的监听，当文件发生变化，重新编译，编译完成之后继续监听。

        内部可能会是用 `fs.watch | fs.watchFile` 来监听的。

    4. 当我监听到文件的变化后（也就是代码变更），会重新编译，并存在内存里，这样快，用的 `memory-fs`。
    5. 编译结束后，WDS 会通过 `socket` 把编译后生成的新的 `hash` 值,然后发送一个 Type hash 的消息，然后又会发送一个 type 为 ok 的信息。
    6. `webpack-dev-server/client/index.js` 当收到了 ok 的消息后，执行 `reloadApp`
    7. 执行`reloadApp`时，如果没有配置 hot，就直接执行`location.reload`刷新页面， 如果配置了，发送一个消息`webpackHotUpdate`出去，并带上 hash 值， 这个 js 的任务完成。

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

    8. 准备热更新并没有直接检查更新，为了职责明确，把事情移交给 `webpack/hot/dev-server.js` 来做。
    9. `webpack/hot/dev-server.js` 里是监听 `webpackHotUpdate` 消息的，收到了`hash` 后会去调用`webpack/lib/HotModuleReplacement.runtime（简称 HMR runtime）（终于上场了了）`中的 `check` 方法，检测是否有新的更新
    10. 在 check 过程中会利用 webpack/lib/JsonpMainTemplate.runtime（简称 jsonp runtime）中的两个方法 `hotDownloadManifest` 和 `hotDownloadUpdateChunk`

    11. 利用上一次保存的 hash 值，调用 `hotDownloadManifest` 发送 `xxx/hash.hot-update.json` 的 ajax 请求

        ![tu](https://user-gold-cdn.xitu.io/2019/12/1/16ec04289af752da?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

        返回的结果中，h 代表本次新生成的 Hash 值，用于下次文件热更新请求的前缀。c 表示当前要热更新的文件对应的是 index 模块。

    12. 然后通过调用 `hotDownloadUpdateChunk` 方法，通过 jsonp 请求最新的模块代码形式，请求 `xxx/hash.hot-update.js` 文件，得到本次改动的文件代码

        ![tu2](https://user-gold-cdn.xitu.io/2019/12/1/16ec04316d6ac5e3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

    13. 通过调用 `hotApply` 进行代码替换。 `hotApply` 做的事情就是删除过期的模块，就是需要替换的模块，然后添加新的模块

    完整的流程图如下

    ![tutu](https://pic1.zhimg.com/80/v2-f7139f8763b996ebfa28486e160f6378_1440w.jpg)

18. 常用的插件

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

            Object.keys(entryFiles).map((index) => {
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
                            removeComments: false
                        }
                    })
                );
            });
            return {
                entry,
                htmlWebpackPlugins
            };
        };
        ```

    7. 开发环境上 sourcemap 和不上的区别，就是上了的话，可以直接看自己写的源代码，而如果不上的话，虽然没有压缩，但是看到的是已经转译后的代码，不方便调试。
    8. 利用 splitchuncksPlugin 来分离代码

        默认情况下，它只会影响到**按需加载**的 chunks，因为修改 initial chunks 会影响到项目的 HTML 文件中的脚本标签。

        比如两个入口文件 A，和 B，它们都引用到了 C。那么 C 肯定是打包两份到对应的文件里了，所以需要有分割操作。

        或者是，比如一个入口文件 A，还有一个按需加载文件 C，都引用到了 D 模块，那么 D 如果多次被引用了，那么就会走 splitChunks 了。

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
                        cache: true // 提升二次构建速度，和loader的cacheDirectory:true 类似
                    })
                ]
            }
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

19. webpack 需要注意的点

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

    9. 想让 css 跑起来的话，要装不少插件 `style-loader` （动态创建 style 标签，将 css 插入到 head 中.）`less-loader` `css-loader`（负责处理 @import 等语句） `postcss-loader`(兼容) autoprefixer。loader 执行顺序是从右往左的。
    10. 当然，loader 其实还有一个参数，可以修改优先级，enforce 参数，其值可以为: pre(优先执行) 或 post (滞后执行)。
    11. url-loader 配置可以读文件，背景图片，大小限制，小于限制的变 dataUrl
    12. 处理 html 上的本地图片，需要安装 html-withimg-loader 插件,但是这样的话，之前的 html 模板语言就不能用了
    13. 配置 output 时，有一个 publickPath: '/'，直接就是根目录，配置成'/truck/', `http://localhost:3000/truck/` 就是默认的 index.html 展示的位子。build 完了后，资源会变成'./truck/xxxx'；
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
    23. `DefinePlugin` 配合`dotenv`这个库，可以在.env 里写环境变量，webpack 首行直接 require('dotenv').config();这些环境变量就被打到了 process.env 里了。然后利用`.env.vm`，和服务器交互即可。可以利用它们，来做符合自己业务不同的环境,详情可以参考[管理自己的 Nodejs 变量](https://zhuanlan.zhihu.com/p/64079159)，也可以直接看[nuxtjs 的源码](https://github.com/nuxt/nuxt.js/blob/dev/packages/webpack/src/config/base.js#L179)
    24. exculde 优先级是高于`include`的
    25. 使用 `cache-loader` 或者是 `babel-loader` 下参数`cacheDirectory`设置为 true，可以让它在构建的过程尝试读取缓存，提高编译时间。
    26. 使用 `HappyPack` 插件/ `thread-loader` 让`webpack`在构建的时候可以同时处理多个子线程/进程，提高构建时间。
    27. 如果使用了不需要构建的第三方依赖，如`Jquery`或者是 loadsh,可以用 module: { noParse: /jquery|loadsh/ } 来搞定。
    28. 如果使用了第三方的包的时候，自己的代码需要用到 `import $ from 'jquery'`，可以配置 externals: { 'jquery': 'jQuery'} ,这样全局就会有 jQuery 变量了。
    29. webpack 自己会有 `tree-shaking` 功能，没有 import 的代码它不会打包出来。
    30. 使用 `scope hosting`，可以自动省略不必要的代码。比如只写了 `let a = 1;let b = 2;let c = a+b;console.log(c);`它会直接打包成 console.log(3);前面的都没了。而这个本身实际上是把多个模块的包裹函数，尽可能的变成一个。
