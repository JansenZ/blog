1. csr ssr spa

   - ssr:

     - 优点：这种页面（html）直出的方式可以让页面首屏较快的展现给用户，对搜索引擎比较友好，有利于 SEO。
     - 缺点：所有页面的加载都需要向服务器请求完整的页面内容和资源，访问量较大的时候会对服务器造成一定的压力，传统的 ssr 页面之间频繁刷新跳转的体验并不是很友好。

   - csr
     优点：

     - 页面之间的跳转不会刷新整个页面，而是局部刷新，体验上有了很大的提升。
     - 单页应用中，只有首次进入或者刷新的时候才会请求服务器，只需加载一次 js css 资源，页面的路由维护在客户端，页面间的跳转就是切换相关的组件所以切换速度很快，另外数据渲染都在客户端完成，服务器只需要提供一个返回数据的接口,大大降低了服务器的压力。
       缺点：

     - SEO 不行
     - 如果 bundlejs 很大的情况下，首屏加载时间过长。

   所以可以每张页面在刷新的时候走 ssr，然后后续操作走 csr，这样既可以解决 seo 的问题，也可以解决首屏慢的问题。

   那么，能够实现 React ssr 的先决条件就是虚拟 dom，有了虚拟 dom 后，加上 node 本身也是 js，react 可以实现服务端和客户端的同构，同构的最大优点是双端可以公用一套代码。

   - prerender
     - 优点，本质上还是 csr,首页 seo 就够了，它在构建阶段就将 html 页面渲染完毕，很快。
     - 缺点，同时，由于是缓存，不会进行二次渲染，也就是说，当初打包时页面是怎么样，那么预渲染就是什么样，如果页面上有数据实时更新，那么浏览器第一次加载的时候只会渲染当时的数据，等到 JS 下载完毕再次渲染的时候才会更新数据更新，会造成数据延迟的错觉。
     - Prerender 就是利用 Chrome 官方出品的 Puppeteer 工具，对页面进行爬取。它提供了一系列的 API, 可以在无 UI 的情况下调用 Chrome 的功能, 适用于爬虫、自动化处理等各种场景。它很强大，所以很简单就能将运行时的 HTML 打包到文件中。原理是在 Webpack 构建阶段的最后，在本地启动一个 Puppeteer 的服务，访问配置了预渲染的路由，然后将 Puppeteer 中渲染的页面输出到 HTML 文件中，并建立路由对应的目录。

   为了实现 ssr，react 内部有

   import ReactDOMServer from 'react-dom/server'

   ReactDOMServer.renderToString(element)

   可以把 react 组件转换成 html。

   在 react 16 前该方法生成的 html 内容的每一个 DOM 节点都有一个 data-react-id 属性，根节点会有一个 data-react-checksum 属性。

   组件在服务端渲染后，在浏览器端还会渲染一次，来完成组件的交互等逻辑。渲染时，react 在浏览器端会计算出组件的 data-react-checksum 属性值，如果发现和服务端计算的值一致，则不会进行客户端渲染。所以 data-react-checksum 属性的作用是为了完成组件的双端对比。

   react 16 以后，不会生成节点，靠 ReactDOM.hydrate()。

   路由的话，客户端用 BrowserRouter，服务端用 StaticRouter。

   服务端是不会执行 didmount，但是会执行 willmount，这也是为啥数据请求别写 willmount 的原因。

   fetch 是不可以在 node 使用，但是 axios 可以。

   然后如果想做数据同构的话，其实也可以自己写一个静态方法

   ```js
   class Foo {
       run(){
           .....
           console.log('hello');
       }
   }

   Foo.method=function(){
       console.log('hello method');
   }
   ```

   这也就可以使用了。

   服务端获取取数据

   先拿到 url 地址。
   `const path = ctx.request.path;`

   查找到的目标路由对象
   `let targetRoute = matchRoute(path,routeList);`

   数据预取 -> fetchResult

   ```js
   let fetchDataFn = targetRoute.component.getInitialProps;
   let fetchResult = {};
   if(fetchDataFn){
       fetchResult = await fetchDataFn();
   }
   ```

   将预取数据在这里传递过去 组内通过 props.staticContext 获取

   ```js
   const context = {
       initialData: fetchResult
   };
   ```

   // 这在服务端渲染的时候，组件里通过`props.staticContext.initialData`就可以获取的到了

   数据脱水

   上述搞定后,ssr 没问题，但是客户端渲染没数据。

   由于客户端存在双端对比机制，导致到了客户端就没了，所以还需要做一层数据脱水，可以把数据藏在某个 displaynone 的元素下，客户端在渲染前获取这个数据，然后存到一个全局变量下。

   所有组件都需要三个判断，第一个判断，是否是 ssr 直出，这个是可以用 webpack 的 DefinePlugin 做全局变量。

   - 如果是的话，直接走服务端数据，通过`props.staticContext.initialData`获取
   - 如果不是服务端的话，还要判断，是不是客户端首次渲染，默认就是，请求完数据后就变成 false
   - 如果不是客户端首次渲染的话，`this.props.history && this.props.history.action === 'PUSH'`;
     路由跳转的时候可以异步请求数据，然后渲染自己请求的数据。

   SEO 动态添加，可以利用`react-helmet`插件，使用起来更方便，自己写的话就是利用做的 initalData 都可以的。

   如果需要分离文件的话，可以利用 import。then，做按需加载。webpack 会给你搞定。

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
       targetRoute.component().props.load().then(res => {
       //异步组件加载完成后再渲染页面
       console.log('异步组件加完成');

       //加载完成再执行 dom 挂载
       renderDom(routeList);
       });
   }
   ```

   在客户端组件，如果页面回退的时候，或者自己 push 的时候 还需要 update 的。

   ```js
   _this = this; // 保证_this指向当前渲染的页面组件
   //注册事件，用于在页面回退
   window.addEventListener('popstate', popStateCallback);

   const canClientFetch = this.props.history && this.props.history.action === 'PUSH';//路由跳转的时候可以异步请求数据
   if (canClientFetch) {
       await this.getInitialProps();
   }
   ```

   最后，完整的描述下 react ssr 全过程。

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
