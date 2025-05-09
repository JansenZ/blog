1. csr ssr 对比
   <details open>

   - ssr 优点：

     1. SEO 友好，页面内容在服务器端生成，搜索引擎可以直接抓取完整的 HTML。
     2. 首屏加载速度快，页面内容在服务器端生成，服务端的内部请求是不受客户设备、网络环境影响的，内部服务的调用相对是比较稳定的。所以速度会较快。
     3. 正因为我拿到了 html，所以我可以 img 和 js 同时加载。而 csr 必须 js 加载完执行完然后渲染 html 才加载图片。

   - ssr 缺点：

     1. 所有页面的加载都需要向服务器请求完整的页面内容和资源，访问量较大的时候会对服务器造成一定的压力，传统的 ssr 页面之间频繁刷新跳转的体验并不是很友好。
     2. 页面想要交互，需要拿到 html 后，下载并执行 js，然后需要完成一次水合操作。
     3. 不用框架的话会稍微有些复杂。

   - csr 优点

     1. 页面之间的跳转不会刷新整个页面，而是局部刷新，体验上有了很大的提升。
     2. 服务器压力小，只需返回静态资源，减少了服务器的计算负担。

   - csr 缺点：
     - SEO 不行
     - 如果 bundle js 很大的情况下，首屏加载时间过长。

   所以 Nuxt/ Next 这类的框架都支持 每张页面在刷新的时候走 ssr，然后后续操作走 csr，这样既可以解决 seo 的问题，也可以解决首屏慢的问题。

   传统的 SSR 在刷新的时候，如果有好多个路径，比如/i/home,/i/mine,/i/other，那是需要在运维端配置多个路径背后的映射的处理逻辑。所以现代 SSR 框架基本都是单入口，即使我在/i/mine 刷新，由于我运维端没有配置，只配置了/i/ 指向我的 ssr 应用，那么我在 SSR 框架里会类似 node Server 一样，在一个前置层处理并转发。

   能够实现 ssr 的先决条件就是虚拟 dom，有了虚拟 dom 后，加上 node 本身也是 js，react 可以实现服务端和客户端的同构，同构的最大优点是双端可以公用一套代码。

2. 描述一下 vue/Nuxt 的 SSR 全流程

    <details open>

   1. 用户访问 url，Nuxt.js 的服务器接收到请求后，根据 URL 路径（如 /home）匹配对应的页面组件。
   2. Nuxt.js 会调用页面组件的 asyncData 或 fetch 方法，预取页面所需的数据。
   3. 如果页面组件使用 Vuex 状态管理，Nuxt.js 会在服务端初始化 Vuex 状态。
   4. Nuxt.js 使用 Vue 的服务端渲染能力（vue-server-renderer）生成 HTML 页面。

      - 数据填充：将 asyncData 或 fetch 获取的数据注入到组件中。
      - 组件渲染：根据组件模板生成 HTML。
        - Vue 实例根据组件模板和数据生成虚拟 DOM。
        - vue-server-renderer 将虚拟 DOM 转换为 HTML 字符串。
        - HTML 字符串中包含 data-server-rendered="true" 标记，表示这是服务端渲染的内容。

   5. 注入全局变量，Nuxt.js 会将服务端生成的数据注入到 HTML 中，通过 window.\_\_NUXT\_\_ 传递给客户端。

      ```js
      window.__NUXT__ = {
        data: [{ message: 'Hello World' }],
        state: { user: { name: 'John' } },
        route: { path: '/home', query: {} },
      }
      ```

   6. 服务端渲染完成，Nuxt.js 将生成的 HTML 页面返回给客户端。
   7. 浏览器加载 Nuxt.js 的客户端 JavaScript 文件（如 /app.js），并执行其中的代码。
   8. 开始水合，接管服务端渲染的 HTML
      - 客户端读取 window.\_\_NUXT\_\_ 中的数据，初始化组件和状态。
      - 客户端代码会根据组件模板和 window.\_\_NUXT\_\_ 中的数据生成虚拟 DOM。
      - Vue 会逐步遍历现有的 DOM 树(document.app)和虚拟 DOM(vdom)，检查节点是否一致。
      - 如果一致，Vue 会复用现有的 DOM 节点。
      - Vue 为现有的 DOM 节点绑定事件监听器和动态逻辑。
   9. 用户可交互，正常走后续流程。

3. 描述一下 React 的 SSR 全流程
   <details open>

   其实 React 和 Vue 的流程基本一致，简单来说就是

   1. 服务端接受请求、匹配路由、然后调用路由对应组件的静态方法获取数据
   2. 服务端把数据注入到 window.initialData 中 或者直接 json.stringify 后藏个隐藏标签下，无所谓
   3. 服务端调用 renderToString 生成 HTML 字符串并返回给客户端
   4. 客户端接收到 HTML 字符串后，解析 HTML 字符串，生成 DOM 树、同时也执行 js 代码
   5. 客户端拿到 window.initialData 数据后，初始化组件，然后调用 render 方法生成虚拟 DOM
   6. Vue 用虚拟 dom 和现有的 dom 树做对比，接管后挂载事件，然后正常交互
   7. React 则是用 dom 树转换成 Fiber 树，客户端的组件也转换成 Fiber 树，所以前后对比的都是 Fiber 树。

   无非就是具体的方法名有些出入，原理是一样的。区别主要是

   1. React，使用 react-dom/server 提供的 renderToString 或 renderToPipeableStream（流失渲染） 方法。
   2. Vue，使用 vue-server-renderer 提供的 renderToString 方法。流式渲染需要额外的插件支持。
   3. 客户端接管的时候，React 用的是 hydrate，Vue 用的是 mount
   4. 事件绑定的时候 React 是用的合成事件，Vue 是原生事件

4. 服务端渲染使用的 renderToString 和客户端使用的 render 的区别？以及 hydrate 和 render 的区别？

   1. renderToString 方法用于将组件渲染为 HTML 字符串。生成的 HTML 包含组件的静态内容，但不包含事件绑定和动态逻辑。
   2. render 方法用于将 React 组件渲染为虚拟 DOM 树。为新生成的 DOM 节点绑定事件监听器
   3. hydrate 方法用于客户端接管服务端渲染的 HTML，拿到当前的 DOM 树和生成的虚拟 DOM 进行比对，比对完成后复用现有的 DOM 节点并绑定事件监听器。
   4. vue 下用的都是\$mount，只不过普通模式和水合模式作用有点区别

      ```js
      Vue.prototype.$mount = function (el, hydrating) {
        el = el && query(el)

        if (!this.$options.render) {
          this.$options.render = createEmptyVNode
        }

        mountComponent(this, el, hydrating)
      }

      function mountComponent(vm, el, hydrating) {
        vm.$el = el

        if (!vm.$options.render) {
          vm.$options.render = createEmptyVNode
        }

        if (hydrating) {
          hydrate(vm.$el, vm.$options.render)
        } else {
          vm.$el = vm.__patch__(vm.$el, vm.$options.render())
        }
      }
      ```

      看代码就比较清晰，如果启用水合模式（hydrating === true），调用 hydrate 方法进行 DOM 比对。如果是正常模式，调用 \_\_patch\_\_ 方法生成新的 DOM。最后都是在方法内部调用 updateListeners（vue2）/ addEventListener(Vue3) 方法， DOM 节点绑定事件监听器。

5. 什么是数据同构？
   <details open>

   数据同构就是，服务端生成的 HTML 页面包含初始数据，客户端接管页面后使用这些数据进行初始化。

   它的目标就是确保服务端渲染的 HTML 和客户端生成的虚拟 DOM 一致，避免水合（Hydration）过程中的不一致问题。

   1. 服务端生成数据

      ```js
      asyncData(context) {
          return axios.get('/api/home').then((res) => {
            return { data: res.data };
          });

        }

      ```

   2. 数据通过全局变量注入到 HTML 中，藏在 HTML 里的一个 script 标签里

      ```html
      <div>其他数据</div>
      <script>
        window.__INITIAL_DATA__ = {
          user: { name: 'John', loggedIn: true },
          posts: [
            { id: 1, title: 'Post 1' },
            { id: 2, title: 'Post 2' },
          ],
        }
      </script>
      ```

   3. 客户端接管页面后，使用 window.\_\_INITIAL_DATA\_\_ 中的数据初始化应用

      ```js
      const store = new Vuex.Store({
        state: window.__INITIAL_DATA__,
      })
      const app = new Vue({
        store,
        render: (h) => h(App),
      }).$mount('#app')
      ```

   4. 数据一致性验证，可以说，数据同构为水合提供了基础，而水合则验证了数据同构的结果，并完成页面的动态交互

6. 什么是水合（Hydration）？水合的过程是怎样的？
    <details open>

   水合（Hydration） 是一种技术，用于将服务端渲染（SSR，Server-Side Rendering）生成的静态 HTML 与客户端的 JavaScript 逻辑结合起来，使页面变得可交互

   水合的流程其实就两个，一是比对 DOM 树和虚拟 DOM 树，一致后复用 HTML,二是把事件绑定到 DOM 上，使得页面变的可交互。

   以 vue3 为例

   ```js
    // 核心水合方法

    export const hydrate = (vnode: VNode, container: Element) => {
      if (!isHydration) {
        console.warn('Hydration can only be performed in SSR mode.')
        return
      }
      // 从根节点触发，比对dom树和虚拟dom
      hydrateNode(container.firstChild, vnode, null, null, null)
    }

    // 递归比对真实DOM与虚拟DOM
    const hydrateNode = (
      node: Node | null, // 当前真实DOM节点
      vnode: VNode,      // 当前虚拟DOM节点
      parentComponent: ComponentInternalInstance | null,
      parentSuspense: SuspenseBoundary | null,
      optimized: boolean
    ): Node | null => {
      if (!node) {
        console.warn('真实DOM节点不存在，无法进行水合')
        return null
      }

      // 1. 比对标签类型
      if (vnode.type !== node.nodeName.toLowerCase()) {
        console.warn('真实DOM与虚拟DOM标签类型不一致')
        return replaceNode(node, vnode) // 替换节点

        // replaceNode就基本执行这个，把虚拟dom生成dom节点然后替换。
        const newNode = createElement(vnode.type) // 根据虚拟DOM创建新节点
        node.parentNode?.replaceChild(newNode, node) // 用新节点替换旧节点
      }

      // 2. 比对属性+绑定事件
      if (vnode.props) {
        hydrateProps(node as Element, vnode.props, parentComponent)
      }

      // 3. 比对子节点
      const children = vnode.children
      if (Array.isArray(children)) {
        let childNode = el.firstChild
        for (let i = 0; i < children.length; i++) {
          // 递归对比
          childNode = hydrateNode(childNode, children[i], parentComponent, parentSuspense, optimized)
        }
      }

      return node
    }

    // 比对真实DOM的属性与虚拟DOM的属性，并更新不一致的部分。
    // 同时负责 事件绑定，通过 addEventListener 将虚拟DOM中的事件绑定到真实DOM节点。
    const hydrateProps = (el: Element, props: Record<string, any>) => {
      for (const key in props) {
        const value = props[key]

        if (isOn(key)) {
          // 事件绑定
          const eventName = key.slice(2).toLowerCase()
          el.addEventListener(eventName, value)
        } else {
          // 属性更新
          const existingValue = el.getAttribute(key)
          if (existingValue !== value) {
            el.setAttribute(key, value)
          }
        }
      }
    }
   ```

7. React 中的水合的过程是怎样的？
    <details open>

   1. 初始化水合过程，创建根 Fiber 树。
   2. 从 DOM 恢复 Fiber 树，根据服务端生成的 HTML 恢复 Fiber 树，并关联 DOM 节点。
   3. 比对 Fiber 树。比对旧 Fiber 树（从 DOM 恢复）和新 Fiber 树（从组件生成），找出差异。
   4. 更新真实 DOM。根据比对结果更新真实 DOM。
   5. 恢复事件监听器。为服务端生成的 DOM 节点绑定事件监听器，使页面变得可交互。

   react16、17、18 都差不多，只是细节上有所变化。React18 入口 API 加了个 Root,然后支持并发渲染。以下是以 React18 为例子

   ```js
   const App = () => {
     return <h1>Hello, SSR!</h1>
   }

   // 调用 hydrateRoot
   hydrateRoot(document.getElementById('root'), <App />)

   // 初始化入口，创建根Fiber
   export function hydrateRoot(container, children) {
     // 创建根 Fiber 树
     const root = createRootImpl(container, true) // `true` 表示启用水合模式

     // 初始化监听事件
     // 在hydrateRoot初始化时调用，但事件处理函数的实际绑定会延迟到restoreStateIfNeeded之后。
     listenToAllSupportedEvents(container)
     // 开始渲染和水合
     root.render(children)
   }
   // 创建根 Fiber 树
   function createRootImpl(container, isHydrating) {
     const root = {
       containerInfo: container, // DOM 容器
       current: createFiberRoot(container, isHydrating), // 创建根 Fiber 节点
     }
     return root
   }

   // 从DOM恢复Fiber树
   export function createFiberRoot(container, isHydrating) {
     const root = {
       containerInfo: container, // DOM 容器
       current: createHostRootFiber(), // 创建根 Fiber 节点
     }

     if (isHydrating) {
       // 初始化水合上下文
       prepareToHydrateHostRoot(root)
     }

     return root
   }

   // 准备比对
   class ReactDOMRoot {
     render(children) {
       const root = this._internalRoot // 获取根 Fiber 树
       updateContainer(children, root, null, null) // 调用 updateContainer
     }
   }

   // 开始比对
   function updateContainer(element, container, parentComponent, callback) {
     const current = container.current // 当前 Fiber 树的根节点
     const workInProgress = createWorkInProgress(current, element) // 创建新的 Fiber 树
     scheduleUpdateOnFiber(workInProgress) // 调度更新
   }
   // 详细比对过程就和RenderUpdate完全一致了，详细的去看React diff。

   // 监听事件
   function listenToAllSupportedEvents(rootContainerElement) {
     // 遍历所有支持的事件类型（如click、change等）
     allNativeEvents.forEach((domEventName) => {
       if (!nonDelegatedEvents.has(domEventName)) {
         // 委托事件（如click）
         listenToNativeEvent(domEventName, false, rootContainerElement)
       } else {
         // 非委托事件（如focus）
         listenToNativeEvent(domEventName, true, rootContainerElement)
       }
     })
   }

   // 通过restoreStateIfNeeded恢复引用，在commit阶段绑定
   function restoreStateIfNeeded(node) {
     const props = getFiberCurrentPropsFromNode(node) // 获取 Fiber 节点的属性
     if (props) {
       // 伪代码，绑定属性及事件
       attachEventListeners(node, props)
     }
   }
   ```

8. 怎么优化水合的过程？
   <details open>

   1. 静态内容标记，这个 vue3 已经支持了
   2. 减少节点的使用，可以减少水合事件
   3. 不重要模块不走 ssr，可以走懒加载，减少比对代码量
   4. 如果支持的话，可以走流式 SSR
   5. 静态内容直接赋值，减少不必要的动态绑定，比如图片地址 src，你都知道就直接赋值就行了
   6. 如果有 Fragment 的话，也可以减少 DOM 节点
   7. React 的话还可以使用 React.lazy、useMemo、useCallback 等优化

9. 什么是流式 SSR？

   <details open>

   它允许服务端在生成 HTML 内容时，将部分内容立即发送到客户端，而不是等待整个页面完全生成后再发送。这种方式可以显著提升页面的首屏渲染速度，改善用户体验。

   1. 服务端开始生成 HTML 内容。
   2. 每当生成一部分 HTML 时，立即通过流发送到客户端。
   3. 客户端接收到部分 HTML 后，开始渲染页面。
   4. 服务端继续生成剩余的内容并发送，直到页面完全生成。

10. 怎么会出现服务端和客户端渲染不一致的报错？
      <details open>

    1. 假如在服务端和客户端都有的生命周期里，根据环境判断修改了不同的数据。
    2. 异步数据未正确处理。
    3. 动态条件渲染不一致。
    4. 动态样式或类名。
    5. 时间戳或随机值。

11. React 数据同构怎么做？
    <details open>

    服务端是不会执行 `didmount`，但是会执行 `willmount`，这也是为啥数据请求别写 `willmount` 的原因。

    所以需要用别的方式去在服务端把数据取出来，可以利用类的静态方法，因为类的静态方法是可以直接访问的，可以在那里去抓数据

    ```js
    class Foo {
      run(){
      .....
      console.log('hello');
      }
    }

    Foo.getData = function(){
    console.log('get data');
    }
    ```

    大致流程如下：

    - 约定并为组件添加数据预取的静态方法
    - 在服务端查找到当前路由对应的组件
    - 调用组件的数据预取方法得到数据
    - 将数据作为属性传入组件
    - 组件内 render 做相应的处理
    - 服务端直出组件
    - 浏览器接管页面，完成渲染

    ```js
    // 组件外调用函数
    export default async (ctx, next) => {
      const path = ctx.request.path
      let targetRoute = matchRoute(path, routeList)
      //数据预取 -> fetchResult
      let fetchDataFn = targetRoute.component.getData
      let fetchResult = {}
      if (fetchDataFn) {
        fetchResult = await fetchDataFn()
      }
      //将预取数据在这里传递过去 组内通过props.staticContext获取
      const context = {
        initialData: fetchResult,
      }
      html = renderToString(
        <StaticRouter location={path} context={context}>
          <App routeList={routeList}></App>
        </StaticRouter>
      )
    }
    // 组件里
    export default class Index extends React.Component {
      constructor(props) {
        super(props)
        //得到初始化数据
        const initialData = props.staticContext.initialData || {}
        this.state = initialData
      }
      static async getData() {
        //...axios
      }
      didmount() {
        // 判断有没有数据，没有的还得请求
        // 用于如果这个页面是SPA点进进来的情况下，是不会有服务端数据的。
      }
      render() {
        // USE this.state
      }
    }
    ```

    这时候还不够，因为双端对比的时候客户端没数据，会导致数据没有，所以需要数据的脱水和注水

    1. 脱水

       把数据藏到一个隐藏标签下

       ```js
       <textarea id="ssrTextInitData" style="display:none;">
         ${JSON.stringify(fetchResult)}
       </textarea>
       ```

       nextjs 是 数据直出到页面后，通过 script 标签来进行包裹，且 type="application/json"，标签内直接是 json 数据。

    2. 注水

       把数据再次放到之前组件注入的时候的 initialData 下，这样就同步了
       `let initialData =JSON.parse( document.getElementById('ssrTextInitData').value);`
