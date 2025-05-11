1. 路由两种设计方式的特点

   <details open>

   1. Hash 路由

      1. 使用 URL 的 hash 部分（#后面的内容）
      2. 变化不会触发页面刷新
      3. 兼容性好（可兼容到 IE8）
      4. URL 不美观
      5. 会导致锚点功能失效
      6. 相同 hash 值不会触发动作将记录加入到历史栈中

         ```js
         // 主要API：
         // 1. 监听hash变化
         window.addEventListener('hashchange', () => {
           console.log(window.location.hash) // 获取hash值
         })

         // 2. 修改hash
         window.location.hash = '/user' // 设置hash值
         ```

   2. History 路由

      1. 使用 HTML5 History API
      2. URL 更美观
      3. 需要服务器配合处理非单页的 url 地址
      4. 兼容性相对较差
      5. 相同路径可以触发动作将记录加入到历史栈中

         ```js
         // 1. 添加历史记录
         history.pushState(state, title, url)
         // 例如：history.pushState(null, '', '/user')

         // 2. 替换当前历史记录
         history.replaceState(state, title, url)
         // 例如：history.replaceState(null, '', '/user')

         // 3. 监听历史记录变化
         window.addEventListener('popstate', () => {
           console.log(window.location.pathname) // 获取当前路径
         })
         ```

2. Hash 路由中，如何判断用户是返回呢？
   <details open>

   1. 在进入 hash 监听函数前，先复制 historyLen = history.length
   2. 在监听函数中，通过两个条件判断：
      1. 比对当前的 history.length 和 historyLen，如果相等，说明触发了 hashchange 但是 historyLen 没变，那它很可能是返回
      2. 比对存储的 historys 数组的倒数第二个和当前的 url，如果相等，那它可能是返回
   3. 为什么说"可能"是返回：
      1. 因为触发返回拦截时再 forward 回来的时候，并没有新增 historyLen
      2. 如果刷新页面后，history 数组会变空，返回就没法正确表示，当然也可以通过一个 session 维护一个 history 数组
      3. 所以需要加上一个容错 flag，当触发了返回拦截的时候，忽略那次 hashchange
      4. 具体写法可以看第 12 题，原生 hash 实现路由

3. Vue-router 的 keepalive 是如何实现的？
    <details open>

   1. 通过抽象组件的方式，不渲染到 DOM 中，只处理逻辑
   2. 通过 Map 对象存储缓存的组件实例，保持组件状态
   3. 通过 LRU 算法管理缓存，自动清理最久未使用的组件
   4. 通过 activated/deactivated 生命周期管理组件状态

   这里需要理解的核心就是怎么把组件缓存下来的。
   keep-alive 相当于空标签一样，只做包括，但是在它的 render 里又能拿到子组件，因为子组件就是我要缓存的内容。
   首次渲染的时候，检查需要缓存，第一次肯定没有实例，所以直接缓存 push 这个 vnode 节点就可以了，然后接下来渲染的时候，会给 vnode.componentInstance 赋值，因为保存的是引用，所以缓存中的 vnode 也是有这个引用的。
   再次渲染的时候，检查需要缓存，就去取 vnode.componentInstance，得到了直接复用就可以了。

   以下可以为核心源码逻辑，只提取核心的部分。

   ```js
   export default {
     name: 'keep-alive',
     abstract: true, // 抽象组件，不会渲染到 DOM

     props: {
       include: patternTypes, // 需要缓存的组件
       exclude: patternTypes, // 不需要缓存的组件
       max: [String, Number], // 最大缓存数量
     },

     created() {
       // 创建缓存对象
       this.cache = Object.create(null)
       // 创建 keys 数组，用于 LRU 算法
       this.keys = []
     },

     destroyed() {
       // 组件销毁时，清理所有缓存DO sth
     },

     mounted() {
       // 监听 include/exclude 变化
     },

     render() {
      const slot = this.$slots.default
      const vnode = getFirstComponentChild(slot)

      if (vnode) {
        const key = vnode.key == null
          ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
          : vnode.key

        if (this.cache[key]) {
          // 如果缓存中有，直接使用缓存的组件实例
          vnode.componentInstance = this.cache[key].componentInstance
          // 更新 keys 顺序，实现 LRU
          remove(this.keys, key)
          this.keys.push(key)
        } else {
          // 如果缓存中没有，则缓存
          this.cache[key] = vnode
          this.keys.push(key)

          // 如果超出最大缓存数量，删除最久未使用的
          if (this.max && this.keys.length > parseInt(this.max)) {
            pruneCacheEntry(this.cache, this.keys[0], this.keys)
          }
        }

        vnode.data.keepAlive = true
      }
      return vnode

    }
   }

   // 注册
   Vue.component('keep-alive', KeepAlive)
   // 模版
   <template>
    <div>
      <keep-alive>
        <component :is="currentComponent" />
      </keep-alive>
    </div>
   </template>

   ```

4. React 路由的缓存实现方案
   <details open>

   - 基于 display: none 的缓存机制，无非就是判断下当前的 path 是不是在缓存数组内，如果不在，说明离开了，直接 display none
   - 支持页面状态管理（active/paused/resumed）暂停和回归，针对缓存使用的
   - 支持最多缓存 10 个页面，因为防止太多的 div 充斥页面，所以需要通过 LRU 支持缓存数量限制
   - 自定义动画效果

   核心的简易实现可以看下[ai 按我的思路实现的 React 缓存路由](https://github.com/JansenZ/blog/blob/master/docs/js/react-cache-router/pages/Example.tsx)

   以下历史留存，可以不看吧
   对于不是 React-router 而言，如果需要缓存的话，需要自己做 activity，一个 activity 就是一个页面，然后跳转事件统一用自己封装的，然后跳转的时候呢，用链表把前后串起来，触发 hashchange，然后在生成新的 activity，然后再 replace 掉，就是隐藏前面的，后面的用新的，而旧的 activity 会缓存起来，数据什么的都在里面。

   刷新： startApp => 注册子应用 => 调用 startApplication => 生成新的 application 实例(包含路由匹配表(子项目注册)，路由跳转方法实例，页面管理器) => 调用 application.start => 开始监听页面 hashchange => 调用 this.navigate => 在路由匹配管理器里，去匹配路由，如果找到了直接返回，找不到还要去 loadProject（尝试加载子应用） => 发送对应链接的请求[怎么 load 的](https://zhenglin.vip/js/resource.js) => 如果是 manifest，直接获取，如果是 html， 正则获取 => 获取到 css 和 js 的路径 => loadJS => 把 js 插入页面中 => 自动加载 js => 进入子应用的 entry.js => 注册子应用的路由 => 这样主应用的`await routeManager.match(url)` 就获取到了值 => 然后`this.currentActivity 是null`，就相当于直接 mount

   跳转： 点击按钮 => transitionTo 方法 => 处理 url，判断是否是原生跳转还是 webview 跳转还是正常跳转， 正常跳转调用 => navigation.forward 方法 => 调用 Navigation 文件下自己的 transitionTo 方法 => 调用 application.navigate 方法 => location.hash = url => 创建或获取新的 activity(返回就是获取，在缓存里取) => `activity => preActivity.next = newActivity, new Activity.prev = preActivity` => 调用 activityManager.replaceActivity。

   如果是返回的话，一样的路径，只是会把 cache 末位的那个删了而已。

5. 如何给页面加 resume, pause 事件。
   <details open>

   首先，只有缓存的情况下，才有必要。

   当跳转到下一张页面的时候，前一张页面 display none。然后就可以触发 pause 事件。

   当页面 active 的时候，判断这个是返回还是前进，返回的话，触发 resume

   [ai 按我的思路实现的 React 缓存路由](https://github.com/JansenZ/blog/blob/master/docs/js/react-cache-router/pages/Example.tsx)

6. 微前端中，子应用如何使用基座的公共类库又不打包呢？

   <details open>

   1. 第一种办法，比如早期的 PAJK 商城里的 trade 和 core，由于当时使用的是 webpack1，根本没有 externals，所以需要手动实现 externals

      core 在 主基座的 entry.js 里 `window.Core = core;`

      然后在子应用里，使用一个自定义 loader 来把代码里的 `import xx from 'core'` 替换为 `var xx = core`或者 `var { component, utils } = core` 这样子。

      [core-loader](https://zhenglin.vip/js/core-loader.js)

   2. 第二种办法，使用 webpack 的 externals

      如果我们想引用一个库，但是又不想让 webpack 打包，并且又不影响我们在程序中以 CMD、AMD 或者 window/global 全局等方式进行使用，那就可以通过配置 externals，其实方案 1 就是 externals 的原理。

      webpack.config.js

      ```js
      module.exports = {
        //...
        externals: {
          jquery: 'jQuery',
        },
      }
      ```

      然后再 index.html 引入这个 js

      ```js
      <script
        src="https://code.jquery.com/jquery-3.1.0.js"
        integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
        crossorigin="anonymous"
      ></script>
      ```

   3. 微前端的方式

   <details open>

   4. iframe

      用于后台比较多，一个框架应用，里面都使用 iframe 来完成。

      缺陷是，虽然应用是隔离了，但是如果都是一个大团队负责的话，都会去加载一边基础类库。

      而且切换的时候会刷新。

      iframe 最大的特性就是提供了浏览器原生的硬隔离方案，不论是样式隔离、js 隔离这类问题统统都能被完美解决。

      但他的最大问题也在于他的隔离性无法被突破，导致应用间上下文无法被共享，随之带来的开发体验、产品体验的问题。

   5. qiankun

      帮助你隔离 js,隔离应用，隔离 css。

      这样切换的时候不会刷新

   6. 自己的微前端

      没有隔离，因为是在前台的，所以我们不需要隔离。

   7. webpack 5 模块联邦

      只需要在 webpack 里插件配置，就可以引用远程应用的模块，并且只是加载一个 js，由 webpack 来解决

      比如 trade,多个页面，可以插进去。当然还是用现在的微前端模式

   8. qiankun 是如何做到沙箱隔离的？

   <details open>

   9. css

      css 主要是依靠命名空间来搞定，最外层就是子应用的 app class

   10. js [15 分钟快速理解 qiankun 的 js 沙箱原理及其实现](https://juejin.cn/post/6920110573418086413)

   11. 如果不支持 proxy，使用 window

       原理：激活沙箱时，将 window 的快照信息存到 windowSnapshot 中， 如果 modifyPropsMap 有值，还需要还原上次的状态；激活期间，可能修改了 window 的数据；退出沙箱时，将修改过的信息存到 modifyPropsMap 里面，并且把 window 还原成初始进入的状态。

       缺陷就是初始化需要遍历 window 属性，退出和进入都需要遍历 window 属性。

       ```js
       const iter = (window, callback) => {
         for (const prop in window) {
           if (window.hasOwnProperty(prop)) {
             callback(prop)
           }
         }
       }
       class SnapshotSandbox {
         constructor() {
           this.proxy = window
           this.modifyPropsMap = {}
         }
         // 激活沙箱
         active() {
           // 缓存active状态的window
           this.windowSnapshot = {}
           iter(window, (prop) => {
             this.windowSnapshot[prop] = window[prop]
           })
           Object.keys(this.modifyPropsMap).forEach((p) => {
             window[p] = this.modifyPropsMap[p]
           })
         }
         // 退出沙箱
         inactive() {
           iter(window, (prop) => {
             if (this.windowSnapshot[prop] !== window[prop]) {
               // 记录变更
               this.modifyPropsMap[prop] = window[prop]
               // 还原window
               window[prop] = this.windowSnapshot[prop]
             }
           })
         }
       }
       ```

   12. 如果支持 proxy 的情况，优先用 proxy。

       优势就是不需要遍历，简单许多，因为并不直接代理 window 对象，激活沙箱后，每次对 window 取值的时候，先从自己沙箱环境的 fakeWindow 里面找，如果不存在，就从 rawWindow(外部的 window)里去找；当对沙箱内部的 window 对象赋值的时候，会直接操作 fakeWindow，而不会影响到 rawWindow。

       ```js
       class ProxySandbox {
         active() {
           this.sandboxRunning = true
         }
         inactive() {
           this.sandboxRunning = false
         }
         constructor() {
           const rawWindow = window
           const fakeWindow = {}
           const proxy = new Proxy(fakeWindow, {
             set: (target, prop, value) => {
               if (this.sandboxRunning) {
                 target[prop] = value
                 return true
               }
             },
             get: (target, prop) => {
               // 如果fakeWindow里面有，就从fakeWindow里面取，否则，就从外部的window里面取
               let value = prop in target ? target[prop] : rawWindow[prop]
               return value
             },
           })
           this.proxy = proxy
         }
       }

       window.sex = '男'
       let proxy1 = new ProxySandbox()
       ;((window) => {
         proxy1.active()
         console.log('修改前proxy1的sex', window.sex)
         window.sex = '女'
         console.log('修改后proxy1的sex', window.sex)
       })(proxy1.proxy)
       ```

   13. 原生 hash 实现路由

   <details open>

   ```js
   class Router {
     constructor() {
       // 储存 hash 与 callback 键值对
       this.routes = {}
       // 当前 hash
       this.currentUrl = ''
       // tp
       this.currentSpUrl = ''
       // 记录出现过的 hash
       this.history = []
       this.ignoreHashChangeCount = 0

       this.refresh = this.refresh.bind(this)
       this.backOff = this.backOff.bind(this)
       this.onchange = this.onchange.bind(this)
       // 默认不是后退操作
       this.isBack = false
       window.addEventListener('load', this.refresh, false)
       window.addEventListener('hashchange', this.onchange, false)

       this.historyLen = history.length
       // 由于history.length 最大是50，所以我们需要额外存一个histoy来进行使用判断。
       // 好像还是有问题的，我没办法解决目前，因为只有靠真正的history.length，才能判读它是真前进后退
       // this.mockHistoryLen = history.length;
     }

     route(path, callback) {
       this.routes[path] = callback || function () {}
     }

     onchange() {
       if (this.ignoreHashChangeCount > 0) {
         this.ignoreHashChangeCount--
         return
       }
       this.currentUrl = location.hash.slice(1) || '/'
       this.currentSpUrl = this.currentUrl + '-' + Date.now()
       console.log(
         '%c======>>>>>>',
         'color: #f20',
         this.historyLen,
         history.length,
         this.mockHistoryLen
       )
       console.log('%c======>>>>>>', 'color: #f20', this.history)
       // 为什么说只有length，因为触发返回拦截的时候再forward回来的时候，并没有新增historylen，所以那次也会触发。
       // 但是，如果加上了后面的那个条件后，在本路由组里没问题，但是如果刷新了后，
       // this.history会变空，那就不行了，返回就没法正确的表示了。
       // 所以，我们需要把条件变成或，然后，加上一个flag，就是容错flag，当触发了返回拦截的时候，忽略那次的hashchange即可
       this.isBack =
         this.historyLen == this.mockHistoryLen ||
         this.currentSpUrl == this.history[this.history.length - 2]
       // 这个事件还真只能新建一次
       this.beforeBack = new Event('beforeback', {
         bubbles: true,
         cancelable: true,
       })
       if (this.isBack) {
         window.dispatchEvent(this.beforeBack)
         console.log('%c======>>>>>+++>', 'color: #f20', this.beforeBack)
         this.history.pop()
         if (this.beforeBack.defaultPrevented) {
           console.log('拒绝返回')
           this.ignoreHashChangeCount++
           history.forward()
           return
         }
       } else {
         this.historyLen = this.mockHistoryLen
         this.mockHistoryLen++
         this.history.push(this.currentSpUrl)
         this.routes[this.currentUrl]()
       }
     }

     refresh() {
       this.currentUrl = location.hash.slice(1) || '/'
       this.currentSpUrl = this.currentUrl + '-' + Date.now()
       this.history.push(this.currentSpUrl)
       this.routes[this.currentUrl]()
     }

     // 后退功能
     backOff() {
       history.back()
     }
   }

   window.router = new Router()
   const button = document.querySelector('button')

   function changeContent(value) {
     document.getElementsByTagName('h1')[0].innerHTML = value
   }

   function onback(e) {
     e && e.preventDefault()
     alert('别想走')
   }

   router.route('/', function () {
     console.log('')
     changeContent('')
   })
   router.route('/a', function () {
     console.log('a')
     changeContent('a')
     window.removeEventListener('beforeback', onback)
   })
   router.route('/b', function () {
     console.log('b')
     changeContent('b')
     window.removeEventListener('beforeback', onback)
   })
   router.route('/c', function () {
     console.log('c')
     changeContent('c')
     window.removeEventListener('beforeback', onback)
   })
   router.route('/d', function () {
     changeContent('d')
     window.addEventListener('beforeback', onback)
   })
   button.addEventListener('click', router.backOff, false)
   ```

7. 微前端的方式
   <details open>

   1. iframe 方案

      用于后台比较多，一个框架应用，里面都使用 iframe 来完成。

      优点：

      - 天然的沙箱隔离，不论是样式隔离、js 隔离这类问题统统都能被完美解决。
      - 实现简单

      缺点：

      - 通信困难，应用间的上下文无法被共享，会有开发体验、产品体验的问题
      - 切换的时候会刷新，不是 SPA
      - 都会去加载一些相同的基础类库，所以性能也比较差。

   2. Web Components 方案

      1. 原生支持，无需框架，使用 Shadow DOM 实现隔离
      2. 天然的隔离性
      3. 性能好
      4. 跨框架使用

      缺点：

      - 兼容性还是不行
      - 通信机制不行
      - 生态也不好

   3. qiankun

      - 基于 single-spa，帮助你提供完整的沙箱隔离。
      - 提供完整的声明周期
      - 提供通信机制

   4. 自己的微前端

      没有隔离，因为是在前台的，所以我们不需要隔离。

   5. webpack 5 模块联邦

      只需要在 webpack 里插件配置，就可以引用远程应用的模块，并且只是加载一个 js，由 webpack 来解决

      比如 trade,多个页面，可以插进去。当然还是用现在的微前端模式

8. 介绍一下 Web Components
    <details open>

   [具体代码例子](https://github.com/JansenZ/blog/blob/master/docs/js/web-component/main-app.js)
   Web Components 是一套浏览器原生 API，允许开发者创建可重用的自定义元素，主要包含三个核心技术：

   1. Custom Elements（自定义元素）

      - 允许开发者创建自定义的 HTML 标签
      - 可以定义新的 HTML 元素
      - 可以扩展现有 HTML 元素

   2. Shadow DOM（影子 DOM）

      - 提供 DOM 和 CSS 的封装
      - 实现样式隔离
      - 防止外部样式影响

   3. HTML Templates（HTML 模板）

      - 定义可重用的 HTML 结构
      - 模板内容不会立即渲染
      - 可以动态实例化

9) customElements 的生命周期有哪些？
    <details open>

   1. constructor()

      - 触发时机：元素实例被创建时
      - 主要用途：
        - 初始化元素状态
        - 设置默认值
        - 创建 Shadow DOM
        - 绑定事件处理器

      ```javascript
      class MyElement extends HTMLElement {
        constructor() {
          super()
          // 必须首先调用 super()
          // 初始化 Shadow DOM
          this.attachShadow({ mode: 'open' })
          // 初始化状态
          this._state = {
            count: 0,
            isActive: false,
          }
          // 绑定方法
          this.handleClick = this.handleClick.bind(this)
        }
      }
      ```

   2. connectedCallback()

      - 触发时机：元素被添加到 DOM 时
      - 主要用途：
        - 设置初始 UI
        - 添加事件监听
        - 获取数据
        - 启动定时器

      ```javascript
      connectedCallback() {
        // 渲染初始 UI
        this.render();

        // 添加事件监听
        this.shadowRoot.querySelector('button')
          .addEventListener('click', this.handleClick);

        // 获取数据
        this.fetchData();

        // 启动定时器
        this._timer = setInterval(() => {
          this.updateTime();
        }, 1000);
      }
      ```

   3. disconnectedCallback()

      - 触发时机：元素从 DOM 中移除时
      - 主要用途：
        - 清理事件监听
        - 取消定时器
        - 断开数据连接
        - 释放资源

      ```javascript
      disconnectedCallback() {
        // 移除事件监听
        this.shadowRoot.querySelector('button')
          .removeEventListener('click', this.handleClick);

        // 清除定时器
        clearInterval(this._timer);

        // 断开数据连接
        this.disconnectFromStore();

        // 释放资源
        this._state = null;
      }
      ```

   4. attributeChangedCallback(name, oldValue, newValue)

      - 触发时机：元素的被观察属性发生变化时
      - 主要用途：
        - 响应属性变化
        - 更新 UI
        - 触发副作用

      ```javascript
      // 定义要观察的属性
      static get observedAttributes() {
        return ['disabled', 'value', 'theme'];
      }

      attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
          case 'disabled':
            this.updateDisabledState(newValue);
            break;
          case 'value':
            this.updateValue(newValue);
            break;
          case 'theme':
            this.updateTheme(newValue);
            break;
        }
      }
      ```

   5. adoptedCallback()

      - 触发时机：元素被移动到新文档时
      - 主要用途：
        - 处理跨文档场景
        - 更新文档上下文
        - 重新初始化资源

      ```javascript
      adoptedCallback() {
        // 更新文档上下文
        this.updateDocumentContext();

        // 重新初始化资源
        this.initializeResources();

        // 更新 UI
        this.render();
      }
      ```

10) 介绍下 shadow DOM 吧
    <details open>

    1. 基本概念

       - Shadow DOM 是 Web Components 的一个重要特性
       - 它允许将封装的"影子"DOM 树附加到主文档 DOM 树中的元素上
       - 提供了真正的 DOM 和样式封装

    2. 核心特性

       - DOM 封装：Shadow DOM 内部的节点对外部不可见
       - 样式隔离：Shadow DOM 内部的样式不会影响外部
       - 作用域：Shadow DOM 内部的事件和样式都在其作用域内
       - 插槽：通过 <slot> 元素实现内容分发

    3. 模式选择

       - open 模式：外部可以通过 element.shadowRoot 访问
       - closed 模式：外部无法访问 Shadow DOM
       - 选择建议：
         - 开发调试用 open
         - 生产环境用 closed
         - 需要外部交互用 open
         - 需要严格封装用 closed

    4. 内容分发

       - 使用 <slot> 元素实现内容分发
       - 支持具名插槽
       - 支持默认内容
       - 支持多个插槽

    5. 事件处理

       - Shadow DOM 内部的事件不会冒泡到外部
       - 可以通过 composed: true 允许事件穿透
       - 支持事件委托

    ```js
    // 基本使用示例
    class MyElement extends HTMLElement {
      constructor() {
        super()
        // 创建 Shadow DOM
        const shadow = this.attachShadow({ mode: 'open' })
        // 添加内容
        shadow.innerHTML = `
          <style>
            .container { color: red; }
          </style>
          <div class="container">Hello Shadow DOM</div>
        `
      }
    }

    // 样式隔离示例
    class StyledElement extends HTMLElement {
      constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        shadow.innerHTML = `
          <style>
            /* 这些样式只会影响 Shadow DOM 内部 */
            p { color: blue; }
            .title { font-size: 20px; }
          </style>
          <p class="title">Shadow DOM 样式</p>
        `
      }
    }

    // 插槽示例
    class SlotElement extends HTMLElement {
      constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        shadow.innerHTML = `
          <div>
            <slot name="header">默认头部</slot>
            <slot>默认内容</slot>
            <slot name="footer">默认底部</slot>
          </div>
        `
      }
    }

    // 事件处理示例
    class EventElement extends HTMLElement {
      constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        shadow.innerHTML = `
          <button>点击我</button>
        `

        // 事件处理
        shadow.querySelector('button').addEventListener('click', (e) => {
          // 默认不会冒泡到外部
          console.log('内部点击')

          // 创建可穿透的事件
          const event = new CustomEvent('shadow-click', {
            bubbles: true,
            composed: true,
          })
          this.dispatchEvent(event)
        })
      }
    }

    // 最佳实践示例
    class BestPracticeElement extends HTMLElement {
      constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'closed' })
        this._shadow = shadow // 内部保存引用

        // 初始化
        this._init()
      }

      _init() {
        this._shadow.innerHTML = `
          <style>
            :host { display: block; }
            .container { padding: 10px; }
          </style>
          <div class="container">
            <slot></slot>
          </div>
        `
      }

      // 提供公共 API
      setContent(content) {
        this._shadow.querySelector('.container').textContent = content
      }

      // 提供主题支持
      setTheme(theme) {
        this._shadow.querySelector(
          '.container'
        ).className = `container ${theme}`
      }
    }
    ```

11) qiankun 是如何做到沙箱隔离的？

    <details open>

    1. css

       css 主要是依靠命名空间来搞定，最外层就是子应用的 app class

       ```js
        // CSS 隔离示例
        // 子应用的根元素会被添加唯一的 class
        <div class="qiankun-app-${appName}">
          <!-- 子应用内容 -->
        </div>

        // 子应用的样式会被自动添加前缀
        .qiankun-app-${appName} .container {
          color: red;
        }

       ```

    2. js [15 分钟快速理解 qiankun 的 js 沙箱原理及其实现](https://juejin.cn/post/6920110573418086413)

       1. 如果不支持 proxy，使用快照沙箱

          原理：激活沙箱时，将 window 的快照信息存到 windowSnapshot 中， 如果 modifyPropsMap 有值，还需要还原上次的状态；激活期间，可能修改了 window 的数据；退出沙箱时，将修改过的信息存到 modifyPropsMap 里面，并且把 window 还原成初始进入的状态。

          缺陷就是初始化需要遍历 window 属性，退出和进入都需要遍历 window 属性。

          ```js
          const iter = (window, callback) => {
            for (const prop in window) {
              if (window.hasOwnProperty(prop)) {
                callback(prop)
              }
            }
          }
          class SnapshotSandbox {
            constructor() {
              this.proxy = window
              this.modifyPropsMap = {}
            }
            // 激活沙箱
            active() {
              // 缓存active状态的window
              this.windowSnapshot = {}
              iter(window, (prop) => {
                this.windowSnapshot[prop] = window[prop]
              })
              Object.keys(this.modifyPropsMap).forEach((p) => {
                window[p] = this.modifyPropsMap[p]
              })
            }
            // 退出沙箱
            inactive() {
              iter(window, (prop) => {
                if (this.windowSnapshot[prop] !== window[prop]) {
                  // 记录变更
                  this.modifyPropsMap[prop] = window[prop]
                  // 还原window
                  window[prop] = this.windowSnapshot[prop]
                }
              })
            }
          }
          ```

       2. 如果支持 proxy 的情况，优先用 proxy。

       优势就是不需要遍历，简单许多，因为并不直接代理 window 对象，激活沙箱后，每次对 window 取值的时候，先从自己沙箱环境的 fakeWindow 里面找，如果不存在，就从 rawWindow(外部的 window)里去找；当对沙箱内部的 window 对象赋值的时候，会直接操作 fakeWindow，而不会影响到 rawWindow。

       ```js
       class ProxySandbox {
         active() {
           this.sandboxRunning = true
         }
         inactive() {
           this.sandboxRunning = false
         }
         constructor() {
           const rawWindow = window
           const fakeWindow = {}
           const proxy = new Proxy(fakeWindow, {
             set: (target, prop, value) => {
               if (this.sandboxRunning) {
                 target[prop] = value
                 return true
               }
             },
             get: (target, prop) => {
               // 如果fakeWindow里面有，就从fakeWindow里面取，否则，就从外部的window里面取
               let value = prop in target ? target[prop] : rawWindow[prop]
               return value
             },
           })
           this.proxy = proxy
         }
       }

       window.sex = '男'
       let proxy1 = new ProxySandbox()
       ;((window) => {
         proxy1.active()
         console.log('修改前proxy1的sex', window.sex)
         window.sex = '女'
         console.log('修改后proxy1的sex', window.sex)
       })(proxy1.proxy)
       ```

12) 原生 hash 实现路由

    <details open>

    ```js
    class Router {
      constructor() {
        // 储存 hash 与 callback 键值对
        this.routes = {}
        // 当前 hash
        this.currentUrl = ''
        // tp
        this.currentSpUrl = ''
        // 记录出现过的 hash
        this.history = []
        this.ignoreHashChangeCount = 0

        this.refresh = this.refresh.bind(this)
        this.backOff = this.backOff.bind(this)
        this.onchange = this.onchange.bind(this)
        // 默认不是后退操作
        this.isBack = false
        window.addEventListener('load', this.refresh, false)
        window.addEventListener('hashchange', this.onchange, false)

        this.historyLen = history.length
        // 由于history.length 最大是50，所以我们需要额外存一个histoy来进行使用判断。
        // 好像还是有问题的，我没办法解决目前，因为只有靠真正的history.length，才能判读它是真前进后退
        // this.mockHistoryLen = history.length;
      }

      route(path, callback) {
        this.routes[path] = callback || function () {}
      }

      onchange() {
        if (this.ignoreHashChangeCount > 0) {
          this.ignoreHashChangeCount--
          return
        }
        this.currentUrl = location.hash.slice(1) || '/'
        this.currentSpUrl = this.currentUrl + '-' + Date.now()
        console.log(
          '%c======>>>>>>',
          'color: #f20',
          this.historyLen,
          history.length,
          this.mockHistoryLen
        )
        console.log('%c======>>>>>>', 'color: #f20', this.history)
        // 为什么说只有length，因为触发返回拦截的时候再forward回来的时候，并没有新增historylen，所以那次也会触发。
        // 但是，如果加上了后面的那个条件后，在本路由组里没问题，但是如果刷新了后，
        // this.history会变空，那就不行了，返回就没法正确的表示了。
        // 所以，我们需要把条件变成或，然后，加上一个flag，就是容错flag，当触发了返回拦截的时候，忽略那次的hashchange即可
        this.isBack =
          this.historyLen == this.mockHistoryLen ||
          this.currentSpUrl == this.history[this.history.length - 2]
        // 这个事件还真只能新建一次
        this.beforeBack = new Event('beforeback', {
          bubbles: true,
          cancelable: true,
        })
        if (this.isBack) {
          window.dispatchEvent(this.beforeBack)
          console.log('%c======>>>>>+++>', 'color: #f20', this.beforeBack)
          this.history.pop()
          if (this.beforeBack.defaultPrevented) {
            console.log('拒绝返回')
            this.ignoreHashChangeCount++
            history.forward()
            return
          }
        } else {
          this.historyLen = this.mockHistoryLen
          this.mockHistoryLen++
          this.history.push(this.currentSpUrl)
          this.routes[this.currentUrl]()
        }
      }

      refresh() {
        this.currentUrl = location.hash.slice(1) || '/'
        this.currentSpUrl = this.currentUrl + '-' + Date.now()
        this.history.push(this.currentSpUrl)
        this.routes[this.currentUrl]()
      }

      // 后退功能
      backOff() {
        history.back()
      }
    }

    window.router = new Router()
    const button = document.querySelector('button')

    function changeContent(value) {
      document.getElementsByTagName('h1')[0].innerHTML = value
    }

    function onback(e) {
      e && e.preventDefault()
      alert('别想走')
    }

    router.route('/', function () {
      console.log('')
      changeContent('')
    })
    router.route('/a', function () {
      console.log('a')
      changeContent('a')
      window.removeEventListener('beforeback', onback)
    })
    router.route('/b', function () {
      console.log('b')
      changeContent('b')
      window.removeEventListener('beforeback', onback)
    })
    router.route('/c', function () {
      console.log('c')
      changeContent('c')
      window.removeEventListener('beforeback', onback)
    })
    router.route('/d', function () {
      changeContent('d')
      window.addEventListener('beforeback', onback)
    })
    button.addEventListener('click', router.backOff, false)
    ```

13) react hash 实现参考
    <details open>

    不管是 hash 还是 history， 只要是 react 组件下的，无非就是三个组件

    - 包装组件 BrowserRouter
    - 渲染组件 Router
    - 跳转组件 Link
      所以思路很简单，包装组件包变化，渲染组件判断 path 渲染对应的组件，link 组件跳转 hash

    唯一的区别就是，包装组件的话，hash 是监听 hashchange， history 是监听 popstate

    link 组件的话，hash 直接跳转#。 history 需要 pushState,然后手动触发

    ```js
    export default class BrowserRouter extends React.Component {
      state = {
        currentPath: utils.extractHashPath(window.location.href),
      }

      onHashChange = (e) => {
        const currentPath = utils.extractHashPath(e.newURL)
        console.log('onHashChange:', currentPath)
        this.setState({ currentPath })
      }

      componentDidMount() {
        window.addEventListener('hashchange', this.onHashChange)
      }

      componentWillUnmount() {
        window.removeEventListener('hashchange', this.onHashChange)
      }

      render() {
        return (
          <RouteContext.Provider
            value={{ currentPath: this.state.currentPath }}
          >
            {this.props.children}
          </RouteContext.Provider>
        )
      }
    }
    export default ({ path, render }) => (
      <RouteContext.Consumer>
        {({ currentPath }) => currentPath === path && render()}
      </RouteContext.Consumer>
    )

    export default ({ to, ...props }) => <a {...props} href={'#' + to} />
    ```

14) 原生 js history 参考
    <details open>

    ```js
    class Routers {
      constructor() {
        this.routes = {}
        // 在初始化时监听popstate事件
        this._bindPopState()
      }
      // 初始化路由
      init(path) {
        history.replaceState({ path: path }, null, path)
        this.routes[path] && this.routes[path]()
      }
      // 将路径和对应回调函数加入hashMap储存
      route(path, callback) {
        this.routes[path] = callback || function () {}
      }

      // 触发路由对应回调
      go(path) {
        history.pushState({ path: path }, null, path)
        this.routes[path] && this.routes[path]()
      }
      // 后退
      backOff() {
        history.back()
      }
      // 监听popstate事件
      _bindPopState() {
        window.addEventListener('popstate', (e) => {
          const path = e.state && e.state.path
          this.routes[path] && this.routes[path]()
        })
      }
    }
    ```

15) history react 参考
    <details open>

    ```js
    export default class HistoryRouter extends React.Component {
      state = {
        currentPath: utils.extractUrlPath(window.location.href),
      }

      onPopState = (e) => {
        const currentPath = utils.extractUrlPath(window.location.href)
        console.log('onPopState:', currentPath)
        this.setState({ currentPath })
      }

      componentDidMount() {
        window.addEventListener('popstate', this.onPopState)
      }

      componentWillUnmount() {
        window.removeEventListener('popstate', this.onPopState)
      }

      render() {
        return (
          <RouteContext.Provider
            value={{
              currentPath: this.state.currentPath,
              onPopState: this.onPopState,
            }}
          >
            {this.props.children}
          </RouteContext.Provider>
        )
      }
    }
    export default ({ path, render }) => (
      <RouteContext.Consumer>
        {({ currentPath }) => currentPath === path && render()}
      </RouteContext.Consumer>
    )
    export default ({ to, ...props }) => (
      <RouteContext.Consumer>
        {({ onPopState }) => (
          <a
            href=""
            {...props}
            onClick={(e) => {
              e.preventDefault()
              window.history.pushState(null, '', to)
              onPopState()
            }}
          />
        )}
      </RouteContext.Consumer>
    )
    ```

16) 动态路由，怎么识别
    <details open>

    核心就 4 个步骤

    - 路径分割
    - 正则转换
    - 参数提取
    - 路由匹配

    ```js
    class Router {
      constructor() {
        this.routes = new Map()
      }

      addRoute(path, component) {
        // 1. 分割路径
        const segments = path.split('/')

        // 2. 转换正则
        const regexPattern = segments
          .map((segment) => {
            if (!segment) return ''

            // 处理动态参数
            return segment.replace(/^(.*):([\w_]+)/, (match, regex, param) => {
              // 存储参数名
              this.params = this.params || []
              this.params.push(param)

              // 返回正则表达式
              return '(' + (regex || '[^\\/]+') + ')'
            })
          })
          .join('\\/')

        // 3. 创建正则对象
        const regex = new RegExp('^' + regexPattern + '$', 'i')

        // 4. 存储路由
        this.routes.set(regex, {
          component,
          params: this.params,
        })
      }

      match(fullPath) {
        // 1. 分离路径和查询参数
        const [path, queryString] = fullPath.split('?')

        // 2. 解析查询参数
        const queryParams = {}
        if (queryString) {
          const searchParams = new URLSearchParams(queryString)
          for (const [key, value] of searchParams.entries()) {
            queryParams[key] = value
          }
        }

        // 3. 匹配路由
        for (const [regex, route] of this.routes) {
          const match = path.match(regex)
          if (match) {
            // 4. 提取路径参数
            const pathParams = {}
            route.params.forEach((param, index) => {
              pathParams[param] = match[index + 1]
            })

            return {
              component: route.component,
              params: {
                ...pathParams,
                query: queryParams,
              },
            }
          }
        }
        return null
      }
    }

    // 使用方式
    const router = new Router()

    // 添加路由
    router.addRoute('/item/:id', ItemComponent)
    router.addRoute('/user/:id/posts/:postId', UserPostsComponent)
    router.addRoute('/item/\\d+:id', ItemComponent) // 只匹配数字ID

    // 匹配路由
    const result = router.match('/item/123')
    // 结果: { component: ItemComponent, params: { id: '123' } }

    // 匹配带查询参数的路由
    const result = router.match('/item/123?color=red&size=large')
    // 结果: {
    //   component: ItemComponent,
    //   params: {
    //     id: '123',
    //     query: {
    //       color: 'red',
    //       size: 'large'
    //     }
    //   }
    // }
    ```
