1. vite 和 webpack 有什么区别？

   - 开发环境：

     - Vite 基于原生 ES 模块，无需打包，按需编译
     - Webpack 需要先打包所有模块，启动较慢
     - Vite 开发服务器启动时间与项目大小无关
     - Webpack 启动时间随项目规模线性增长

     ```javascript
     // Vite 开发环境下的模块加载
     import { createApp } from 'vue' // 浏览器直接请求这个模块

     // Webpack 开发环境下的模块加载
     // webpack.config.js
     module.exports = {
       entry: './src/main.js',
       output: {
         filename: 'bundle.js',
       },
     }
     // 需要先打包成 bundle.js 才能运行
     ```

   - 热更新：

     - Vite 基于原生 ES 模块的 HMR，更新更快
     - Webpack 需要重新打包模块，更新较慢
     - Vite 的 HMR 基于浏览器原生能力，无需额外处理
     - Webpack 的 HMR 需要维护模块依赖图

     ```javascript
     // Vite 的 HMR 实现
     if (import.meta.hot) {
       import.meta.hot.accept((newModule) => {
         // 模块更新后的回调
       })
     }

     // Webpack 的 HMR 实现
     if (module.hot) {
       module.hot.accept('./module.js', () => {
         // 模块更新后的回调
       })
     }
     ```

   - 构建工具：

     - Vite 开发环境使用原生 ES 模块，生产环境使用 Rollup
     - Webpack 开发和生产环境都使用自己的打包器
     - Vite 生产构建使用 Rollup，配置更简单，输出更优化
     - Webpack 配置复杂但更灵活，插件生态更丰富

     ```javascript
     // Vite 生产构建配置
     // vite.config.js
     export default {
       build: {
         rollupOptions: {
           output: {
             manualChunks: {
               vendor: ['vue', 'vue-router'],
             },
           },
         },
       },
     }

     // Webpack 生产构建配置
     // webpack.config.js
     module.exports = {
       optimization: {
         splitChunks: {
           chunks: 'all',
           cacheGroups: {
             vendor: {
               test: /[\\/]node_modules[\\/]/,
               name: 'vendors',
             },
           },
         },
       },
     }
     ```

   - 配置复杂度：

     - Vite 配置更简单，开箱即用
     - Webpack 配置相对复杂，需要更多配置
     - Vite 的插件 API 更简单，学习成本低
     - Webpack 的 loader 和 plugin 系统更复杂但更强大

     ```javascript
     // Vite 插件示例
     export default function myPlugin() {
       return {
         name: 'my-plugin',
         transform(code, id) {
           // 转换代码
           return code
         },
       }
     }

     // Webpack loader 示例
     module.exports = function (source) {
       // 转换代码
       return source
     }
     ```

   - 环境变量处理：

     - Vite 使用 import.meta.env 访问环境变量
     - Webpack 使用 process.env 访问环境变量
     - Vite 的环境变量在构建时静态替换
     - Webpack 需要 DefinePlugin 处理环境变量
     - Vite 支持 .env 文件的自动加载
     - Vite 的环境变量类型提示更完善

     ```javascript
     // Vite 环境变量使用
     console.log(import.meta.env.VITE_API_URL)

     // Webpack 环境变量配置
     // webpack.config.js
     const webpack = require('webpack')
     module.exports = {
       plugins: [
         new webpack.DefinePlugin({
           'process.env.API_URL': JSON.stringify(process.env.API_URL),
         }),
       ],
     }
     ```

2. vite 开发的时候，是怎么处理 import xx from node 包 的？

   - 预构建阶段：

     - 首次启动时，Vite 会扫描 package.json 中的依赖
     - 使用 esbuild 对依赖进行预构建
     - 将 CommonJS/UMD 格式的依赖转换为 ES 模块格式
     - 预构建结果缓存在 node_modules/.vite 目录下
     - 预构建过程使用 esbuild，速度是传统打包工具的 10-100 倍
     - 预构建会处理依赖的依赖关系，确保所有依赖都是 ES 模块格式

     ```javascript
     // Vite 预构建配置
     // vite.config.js
     export default {
       optimizeDeps: {
         include: ['lodash-es'], // 预构建的依赖
         exclude: ['@vueuse/core'], // 排除的依赖
       },
     }

     // 预构建后的模块示例
     // node_modules/.vite/lodash-es.js
     export { default } from 'lodash-es'
     export * from 'lodash-es'
     ```

   - 依赖解析机制：

     - 优先使用 package.json 中的 "module" 字段
     - 其次使用 "main" 字段
     - 支持 package.json 中的 "exports" 字段
     - 自动处理依赖的依赖关系
     - 支持 package.json 中的 "browser" 字段
     - 支持 package.json 中的 "types" 字段

     ```json
     // package.json 示例
     {
       "name": "my-package",
       "module": "dist/index.esm.js",
       "main": "dist/index.cjs.js",
       "browser": "dist/index.umd.js",
       "exports": {
         ".": {
           "import": "./dist/index.esm.js",
           "require": "./dist/index.cjs.js"
         }
       }
     }
     ```

   - 浏览器请求处理：

     - 当浏览器请求 node_modules 中的模块时
     - Vite 服务器拦截请求
     - 返回预构建后的 ES 模块
     - 支持按需加载，只加载实际使用的代码
     - 处理模块的副作用（side effects）
     - 支持模块的 tree-shaking

     ```javascript
     // 浏览器中的模块请求
     import { debounce } from 'lodash-es'

     // Vite 服务器处理后的响应
     // 返回预构建的 ES 模块
     export { debounce } from './node_modules/.vite/lodash-es.js'
     ```

   - 优化策略：

     - 将多个内部模块的依赖打包成单个模块
     - 处理循环依赖问题
     - 优化依赖的加载性能
     - 支持依赖的按需加载
     - 使用 HTTP 缓存优化加载性能
     - 支持依赖的预加载

     ```javascript
     // Vite 依赖优化配置
     // vite.config.js
     export default {
       build: {
         commonjsOptions: {
           include: [/node_modules/],
           transformMixedEsModules: true,
         },
       },
     }
     ```

   - 特殊情况处理：

     - 处理 CSS 模块的导入
     - 处理静态资源的导入
     - 处理 JSON 文件的导入
     - 处理 TypeScript 类型声明文件
     - 处理 WASM 模块
     - 处理 Web Workers

     ```javascript
     // 各种模块导入示例
     import styles from './styles.module.css'
     import json from './data.json'
     import wasm from './module.wasm'

     // Web Worker
     const worker = new Worker(new URL('./worker.js', import.meta.url))
     ```

3. vite 的热更新是怎么做的？

   - 基于原生 ES 模块：

     - 利用浏览器原生的模块系统
     - 无需重新打包整个应用
     - 模块的更新是即时的
     - 支持模块的按需更新

     ```javascript
     // 模块热更新示例
     if (import.meta.hot) {
       import.meta.hot.accept((newModule) => {
         // 模块更新后的回调
         console.log('模块已更新')
       })
     }
     ```

   - 精确更新：

     - 只更新修改的模块
     - 保持应用状态
     - 支持组件的状态保持
     - 支持 CSS 模块的热更新
     - 支持样式的作用域隔离

     ```javascript
     // Vue 组件热更新示例
     <script>
     export default {
       data() {
         return { count: 0 }
       }
     }

     if (import.meta.hot) {
       import.meta.hot.accept((newModule) => {
         // 保持组件状态
         const newCount = newModule.default.data().count
         this.count = newCount
       })
     }
     </script>
     ```

   - 更新流程：

     1. 监听文件变化
        - 使用 chokidar 监听文件系统
        - 支持多种文件变化事件
        - 支持忽略特定文件

     ```javascript
     // Vite 文件监听配置
     // vite.config.js
     export default {
       server: {
         watch: {
           usePolling: true,
           interval: 100,
         },
       },
     }
     ```

     2. 确定需要更新的模块
        - 分析模块依赖关系
        - 确定更新范围
        - 处理循环依赖

     ```javascript
     // 模块依赖分析
     const moduleGraph = new Map()

     function updateModule(id) {
       const mod = moduleGraph.get(id)
       if (!mod) return

       // 更新模块
       mod.update()

       // 更新依赖模块
       for (const dep of mod.deps) {
         updateModule(dep)
       }
     }
     ```

     3. 发送更新消息给浏览器
        - 使用 WebSocket 通信
        - 发送模块更新信息
        - 处理更新失败的情况

     ```javascript
     // WebSocket 通信示例
     const ws = new WebSocket('ws://localhost:3000')

     ws.onmessage = (event) => {
       const { type, id } = JSON.parse(event.data)
       if (type === 'update') {
         // 处理模块更新
         import(`/src/${id}?t=${Date.now()}`)
       }
     }
     ```

     4. 浏览器重新请求更新的模块
        - 使用动态 import 加载新模块
        - 处理模块加载错误
        - 支持模块的回退机制

     ```javascript
     // 动态导入示例
     async function loadModule(id) {
       try {
         const mod = await import(`/src/${id}?t=${Date.now()}`)
         return mod
       } catch (err) {
         console.error('模块加载失败:', err)
         // 回退到之前的版本
         return previousModule
       }
     }
     ```

   - 优势：

     - 更新速度更快
     - 不会丢失应用状态
     - 支持 CSS 模块热更新
     - 支持自定义 HMR 处理
     - 支持框架特定的 HMR 处理
     - 支持插件的 HMR 处理

     ```javascript
     // 自定义 HMR 处理
     if (import.meta.hot) {
       import.meta.hot.accept((newModule) => {
         // 自定义更新逻辑
         if (newModule) {
           // 更新成功
           console.log('更新成功')
         } else {
           // 更新失败
           console.log('更新失败')
         }
       })
     }
     ```

   - 实现细节：

     - 使用 WebSocket 实现服务器和浏览器的通信
     - 支持模块的版本控制
     - 支持模块的依赖追踪
     - 支持模块的缓存控制
     - 支持模块的预加载
     - 支持模块的错误处理

     ```javascript
     // 模块版本控制
     const moduleVersions = new Map()

     function updateModuleVersion(id) {
       const version = Date.now()
       moduleVersions.set(id, version)
       return version
     }

     // 模块缓存控制
     const moduleCache = new Map()

     function clearModuleCache(id) {
       moduleCache.delete(id)
     }
     ```

4. vite 的缺点

   - 浏览器兼容性：

     - 依赖原生 ES 模块，不支持旧版浏览器
     - 需要额外的 polyfill 支持
     - 开发环境可能遇到兼容性问题

     ```javascript
     // 需要处理浏览器兼容性
     // vite.config.js
     export default {
       build: {
         target: 'es2015', // 需要设置目标环境
         polyfillDynamicImport: true, // 需要动态导入的 polyfill
       },
     }
     ```

   - 生态成熟度：

     - 相比 Webpack 插件生态不够丰富
     - 部分高级功能需要自行实现
     - 社区资源相对较少

     ```javascript
     // 某些高级功能需要自定义实现
     // 例如：自定义资源处理
     export default {
       plugins: [
         {
           name: 'custom-asset',
           transform(code, id) {
             if (id.endsWith('.custom')) {
               // 需要自己实现资源处理逻辑
               return {
                 code: processCustomAsset(code),
                 map: null,
               }
             }
           },
         },
       ],
     }
     ```

   - 构建优化：

     - 生产环境构建速度可能不如预期
     - 大型项目可能需要更多优化配置
     - 代码分割策略需要更多手动配置

     ```javascript
     // 需要手动优化构建配置
     // vite.config.js
     export default {
       build: {
         rollupOptions: {
           output: {
             manualChunks: {
               // 需要手动配置代码分割
               vendor: ['vue', 'vue-router', 'vuex'],
               utils: ['./src/utils'],
               components: ['./src/components'],
             },
           },
         },
         chunkSizeWarningLimit: 1000, // 需要调整警告阈值
         sourcemap: true, // 需要额外配置 sourcemap
       },
     }
     ```

   - 开发体验：

     - 首次启动需要预构建依赖
     - 某些场景下热更新可能不够稳定
     - 调试工具支持不够完善

     ```javascript
     // 需要处理预构建问题
     // vite.config.js
     export default {
       optimizeDeps: {
         // 需要手动配置预构建
         include: ['lodash-es', 'axios'],
         exclude: ['@vueuse/core'],
         // 需要处理预构建缓存
         force: true, // 强制预构建
       },
       server: {
         // 需要配置开发服务器
         hmr: {
           overlay: false, // 关闭错误覆盖层
         },
       },
     }
     ```

   - 特殊场景支持：

     - 微前端支持不够完善
     - 某些特殊模块需要额外处理
     - 多页面应用配置较复杂

     ```javascript
     // 多页面应用配置示例
     // vite.config.js
     export default {
       build: {
         rollupOptions: {
           input: {
             main: 'index.html',
             about: 'about.html',
             // 需要手动配置每个页面
             contact: 'contact.html',
           },
         },
       },
     }
     ```

   - 调试能力：

     - 生产环境调试相对困难
     - 错误追踪可能不够精确
     - 性能分析工具支持有限

     ```javascript
     // 需要额外的调试配置
     // vite.config.js
     export default {
       build: {
         sourcemap: true,
         minify: 'terser',
         terserOptions: {
           // 需要配置 sourcemap 和压缩选项
           sourceMap: true,
           compress: {
             drop_console: false, // 保留 console 用于调试
           },
         },
       },
     }
     ```

   - 迁移成本：

     - 从 Webpack 迁移需要重构配置
     - 部分插件需要寻找替代方案
     - 团队需要学习新的开发模式

     ```javascript
     // 需要重构的配置示例
     // 原 Webpack 配置
     module.exports = {
       module: {
         rules: [
           {
             test: /\.css$/,
             use: ['style-loader', 'css-loader'],
           },
         ],
       },
     }

     // Vite 配置
     export default {
       css: {
         // 需要重新学习 Vite 的配置方式
         modules: {
           localsConvention: 'camelCase',
         },
       },
     }
     ```
