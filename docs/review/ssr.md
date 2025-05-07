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

2. 描述一下 vue/Nuxt 的 SSR 全流程（要说服务端 renderTostring 和客户端的区别）
3. 描述一下 React 的 SSR 全流程（要说服务端 renderTostring 和客户端的区别）
4. 什么是水合（Hydration）？
5. 怎么优化水合的过程？
6. 什么是数据同构？
7. 什么是流式 SSR？
8. 怎么会出现服务端和客户端渲染不一致的报错？
9. hydrate 和 render 的区别？

10. React 数据同构怎么做？

    fetch 是不可以在 node 使用，但是 axios 可以。

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
        const path = ctx.request.path;
        let targetRoute = matchRoute(path, routeList);
        //数据预取 -> fetchResult
        let fetchDataFn = targetRoute.component.getData;
        let fetchResult = {};
        if (fetchDataFn) {
            fetchResult = await fetchDataFn();
        }
        //将预取数据在这里传递过去 组内通过props.staticContext获取
        const context = {
            initialData: fetchResult
        };
        html = renderToString(
            <StaticRouter location={path} context={context}>
                <App routeList={routeList}></App>
            </StaticRouter>
        );
    };
    // 组件里
    export default class Index extends React.Component {
        constructor(props) {
            super(props);
            //得到初始化数据
            const initialData = props.staticContext.initialData || {};
            this.state = initialData;
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

11. 完整的描述下 react ssr 全过程。

    1. 客户端访问 url
    2. url 打到 node 服务器，node 拿到 url 后，路由解析 path，找到对应的路由组件。
    3. 然后调用组件下的 getdata 方法，服务器接收到请求后返回数据
    4. node 把这个数据放到 StaticRouter 的 context 属性下，这样组件里就可以通过 props.staticContext 获取对应数据。

    ```js
    html = renderToString(<StaticRouter location={path} context={context}>
        <App routeList={staticRoutesList}></App>
        </StaticRouter>);
    }
    ```

    5. 然后还顺便放一份这个数据给一个 display none 的标签下，用于后续同构的时候双端对比使用（数据脱水）
    6. 渲染组件并返回 HTML 的结果，服务端渲染完成
    7. 客户端显示 HTML 内容后，加载 Bundle.js，然后进行客户端渲染（接管整个页面，并绑定交互事件）
    8. 客户端渲染找到对应标签里的数据，存到全局下，然后在渲染的组件的时候做对应的判断，完成 csr 部分
    9. 切换标签页，成为一个 spa。该咋走咋走。
