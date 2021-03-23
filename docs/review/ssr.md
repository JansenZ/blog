1. csr ssr spa 对比

    - ssr:

        - 优点：这种页面（html）直出的方式可以让页面首屏较快的展现给用户，对搜索引擎比较友好，有利于 SEO。
        - 缺点：所有页面的加载都需要向服务器请求完整的页面内容和资源，访问量较大的时候会对服务器造成一定的压力，传统的 ssr 页面之间频繁刷新跳转的体验并不是很友好。

    - csr 优点
        - 页面之间的跳转不会刷新整个页面，而是局部刷新，体验上有了很大的提升。
        - 单页应用中，只有首次进入或者刷新的时候才会请求服务器，只需加载一次 js css 资源，页面的路由维护在客户端，页面间的跳转就是切换相关的组件所以切换速度很快，另外数据渲染都在客户端完成，服务器只需要提供一个返回数据的接口,大大降低了服务器的压力。
    - csr 缺点：
        - SEO 不行
        - 如果 bundlejs 很大的情况下，首屏加载时间过长。

    所以可以每张页面在刷新的时候走 ssr，然后后续操作走 csr，这样既可以解决 seo 的问题，也可以解决首屏慢的问题。

    那么，能够实现 React ssr 的先决条件就是虚拟 dom，有了虚拟 dom 后，加上 node 本身也是 js，react 可以实现服务端和客户端的同构，同构的最大优点是双端可以公用一套代码。

    - prerender
        - 优点，本质上还是 csr,首页 seo 就够了，它在构建阶段就将 html 页面渲染完毕，很快。
        - 缺点，同时，由于是缓存，不会进行二次渲染，也就是说，当初打包时页面是怎么样，那么预渲染就是什么样，如果页面上有数据实时更新，那么浏览器第一次加载的时候只会渲染当时的数据，等到 JS 下载完毕再次渲染的时候才会更新数据更新，会造成数据延迟的错觉。
        - Prerender 就是利用 Chrome 官方出品的 Puppeteer 工具，对页面进行爬取。它提供了一系列的 API, 可以在无 UI 的情况下调用 Chrome 的功能, 适用于爬虫、自动化处理等各种场景。它很强大，所以很简单就能将运行时的 HTML 打包到文件中。原理是在 Webpack 构建阶段的最后，在本地启动一个 Puppeteer 的服务，访问配置了预渲染的路由，然后将 Puppeteer 中渲染的页面输出到 HTML 文件中，并建立路由对应的目录。

2. ReactDom.hydrate 和 ReactDom.render 区别

    hydrate 与 render() 相同，但它用于在 ReactDOMServer 渲染的容器中对 HTML 的内容进行 hydrate 操作。React 会尝试在已有标记上绑定事件监听器。

3. renderToString 和 renderToNodeStream

    renderToString 将 React 元素渲染为初始 HTML。React 将返回一个 HTML 字符串。

    你可以使用此方法在服务端生成 HTML，并在首次请求时将标记下发，以加快页面加载速度，并允许搜索引擎爬取你的页面以达到 SEO 优化的目的。

    而 renderToNodeStream 返回一个可输出 HTML 字符串的可读流。采用流的话，可以边读边输出，可以要让页面更快的展现，缩短首屏展现时间。

4. 如何给 react 挂载事件？

    在 node 端使用 renderToString 方法，渲染了对应组件后，这个组件的方法是没有的，因为 renderToString 仅仅是转换成了原始的 html,所以浏览器端使用 hydrate()来再次包裹组件，它内部会进行一个双端对比机制，尽可能的复用服务端下发的，这样只需要挂事件，不需要重新渲染。

5. 双端路由

    路由的话，客户端用 `BrowserRouter`，服务端用 `StaticRouter`。

    为实现这个，其实前端还是原来的那一套，只是在跳转页面的时候，如果你是 history 的形式，跳转后刷新页面就需要服务端了，那这个时候会通过 node 去解析地址，然后指向即可完成。

    ```js
    const path = ctx.request.path;
    renderToString(
        <StaticRouter location={path}>
            <App routeList={routeList}></App>
        </StaticRouter>
    );
    ```

6. 数据同构怎么做？

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

7. 完整的描述下 react ssr 全过程。

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
    7. 客户端显示 HTML 内容后，加载 Bundle.js，然后进行客户端渲染（接管整个页面，并绑定交互时间）
    8. 客户端渲染找到对应标签里的数据，存到全局下，然后在渲染的组件的时候做对应的判断，完成 csr 部分
    9. 切换标签页，成为一个 spa。该咋走咋走。

ssr 全流程
![tu](https://user-gold-cdn.xitu.io/2020/1/28/16fe82eb96f4a852?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

7. old

    数据脱水

    上述搞定后,ssr 没问题，但是客户端渲染没数据。

    由于客户端存在双端对比机制，导致到了客户端就没了，所以还需要做一层数据脱水，可以把数据藏在某个 displaynone 的元素下，客户端在渲染前获取这个数据，然后存到一个全局变量下。

    所有组件都需要三个判断，第一个判断，是否是 ssr 直出，这个是可以用 webpack 的 DefinePlugin 做全局变量。

    - 如果是的话，直接走服务端数据，通过`props.staticContext.initialData`获取
    - 如果不是服务端的话，还要判断，是不是客户端首次渲染，默认就是，请求完数据后就变成 false
    - 如果不是客户端首次渲染的话，`this.props.history && this.props.history.action === 'PUSH'`;
      路由跳转的时候可以异步请求数据，然后渲染自己请求的数据。

8. SEO 动态添加，可以利用`react-helmet`插件，使用起来更方便，自己写的话就是利用做的 initalData 都可以的。

9. 如果需要分离文件的话，可以利用 import。then，做按需加载。webpack 会给你搞定。

    ```js
    路由：  AsyncLoader(() => import('../pages/index')),
    HOC：  function asyncFn(props) {
            return <AsyncBundle load={loader}>
                    {(Comp) => <Comp {...props}/>}
                </AsyncBundle>
            }
        }
    AsyncBundle:
    componentDidMount() {
        if (!this.state.mod) {
            this.load(this.props);
        }
    }

    load(props) {
        this.setState({
            mod: null
        });
        //注意这里，使用Promise对象; mod.default导出默认
        props.load().then((mod) => {
            this.setState({
                mod: mod.default ? mod.default : mod
            });
        });
    }

    render() {
        return this.state.mod ? this.props.children(this.state.mod) : <LoadingCompoent/>;
    }
    ```

    客户端是这样的路由，但是服务端需要把动态的再转成静态的，防止比对失败。

    ```js
    if (checkIsAsyncRoute(item.component)) {
        staticRoutes.push({
            ...item,
            component: (await item.component().props.load()).default
        });
    }
    ```

    但是这样会导致服务端渲染完了，到了客户端后，由于是按需加载，还要请求一次 js，会导致页面刷一下变成 loader，然后再渲染。

    所以解决方案就是在客户端渲染入口，找到对应的 url 组件，如果是按需加载的，让它组件加载完再渲染页面。

    ```js
    //****等待异步脚本加载完成****
    if (targetRoute.component[proConfig.asyncComponentKey]) {
        targetRoute
            .component()
            .props.load()
            .then(res => {
                //异步组件加载完成后再渲染页面
                console.log("异步组件加完成");

                //加载完成再执行 dom 挂载
                renderDom(routeList);
            });
    }
    ```

    在客户端组件，如果页面回退的时候，或者自己 push 的时候 还需要 update 的。

    ```js
    _this = this; // 保证_this指向当前渲染的页面组件
    //注册事件，用于在页面回退
    window.addEventListener("popstate", popStateCallback);

    const canClientFetch =
        this.props.history && this.props.history.action === "PUSH"; //路由跳转的时候可以异步请求数据
    if (canClientFetch) {
        await this.getInitialProps();
    }
    ```
