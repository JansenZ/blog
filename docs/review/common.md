### 综合

1. 性能优化

   1. webpack 构建优化，使用 include/exclude.Happypack 开启多线程.自带的 tree-shaking 移除无用代码，自带的 hosit-scoping，移除无用计算。利用 import.then 拆分,babel 设置缓存。
   2. http 网络请求开启 gzip，可以压缩 HTTP 响应的 70%。这个要服务端配置一下，会增大 CPU 的开销去解压、压缩，Webpack 中 用 CompressionWebpackPlugin 插件开启 Gzip ,事实上就是为了在构建过程中去做一部分服务器的工作，为服务器分压。
      2.1 使用 CDN 缓存。dns 预解析，dns prefetch，可以预解析。script defer async 防止 js 阻塞。
   3. 图片也做好压缩，雪碧图, 小图使用 base64 可以减少请求，大图不能用 bas64，因为 base64 会膨胀到 4/3 大小，那时候省的 http 请求还不如膨胀的多。然后 svg 的话渲染成本比较高，而且对设计要求也比较高。
   4. webp 格式，前端处理的话，包装 src 函数，然后去 caniuse 维护一个浏览器支持的表，然后支持就用 webp 不支持直接把 webp 分割掉就可以了。
   5. webp 格式，后端处理的话，就是判断我图片过去的请求头 accept 里有没有 img/webp。有就说明我这浏览器支持，然后就吐给我 webp 的资源就可以了。比如 Chrome 就有，safari 就没有
   6. 使用 HTTP 强缓存，cache-control > expires。expire 里面写的是过期日期，是和本地电脑比的，而 cache-control 是过期时间段，所以 cache-control 更准。
   7. cache-control 值，public，本地和服务器都会缓存走强缓存，private，只有本地缓存走强缓存，no-cache，本地缓存，但是会绕过强缓存去协商。no-store 的话就直接绕过所有全部重新下载了
   8. 使用 HTTP 协商缓存，协商缓存本身数据也是存在本地的， Last-Modified（请求带上 If-Modified-Since），返回 304，但是如果改了文件名的话，last-modified 就找不到了，就会重新返回。所以还要一个 etag（请求带上 If-None-Match），两者共同配合完成 304.
   9. 体积不大的会放在 from memory cahce，比如 base64,小的 css，体积稍大会放 from disk cache。
   10. 还可以使用 service worker。
   11. 以上 http 的缓存，实际上现在多数都是后台网关缓存，走 redis。永远给我 200。
   12. 本地存储，cookie,storage。 cookie 里少放信息，因为会跟着 http 请求头跑，很浪费。如果本地存储需求量很大的话，比如你要实现一个 im 的话，可以用 indexDB,本地数据库
   13. 采用服务端渲染，当然了，会加大服务端的消耗。
   14. react 本身的虚拟 dom，react fiber 计算 diff。（减少比对 dom 的成本）减少操作 dom。有效的减少回流和重绘。
   15. 比如图片给定好它的高度。也可以减少回流。offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、clientTop、clientLeft、clientWidth、clientHeight 这些属性的获取，都会触发回流。
   16. 不重要的类似日志打点这样的，放在 requestidlecallback
   17. 图片懒加载 intersectionobserver
   18. 防抖（搜索输入）、节流(scroll 监听)
   19. ssr

2. 设计模式

   我认为很多设计模式我们在不知道它的名字的时候，我们就已经在用它了，

   - 工厂模式
     批量创建对象
     当同一个构造函数，需要多次 new 的时候，就需要考虑是不是可以用 工厂模式 来批量的创建实例对象了

   - 单例模式
     全局共享对象
     通常它会有一个 getInstance 方法，里面利用闭包来让大家共享一个对象

   ```js
   getInstance() {
       let instance;
       return function() {
           if(!instance) {
               instance = new XXXX();
           }
           return instance;
       }
   }
   ```

   当遇到多个地方需要公用一个东西，比如全局地址，登陆框的时候，就需要考虑是否要用 单例模式 了。

   - 职责链模式
     把一个复杂的链路 function 拆成若干个小的，然后连成一条链，知道有一个对象处理它为止。
     就像作用域链，原型链，事件冒泡一样。可以降低耦合度，职责更加的单一。

   - 组合模式优于继承模式
     继承的最大问题在于：无法决定继承哪些属性，所有属性都得继承。这样对于如何定义父类边界是非常值得考究的
     用组合的话，可以拼装，就可以避免这个问题。

3. 为什么用 React + mobx？

   React 和 Vue 有许多相似之处，它们都有：
   - 使用 Virtual DOM
   - 提供了响应式 (Reactive) 和组件化 (Composable) 的视图组件。
   - 将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库。
   - React 比 Vue 有更丰富的生态系统。

   确实，mobx 的实现原理类似于 vue 的数据双向绑定，用了这个，可以让 react 的数据管理如 vue 一般容易，而且又能享受到 jsx 的快感，包括不限于 hooks

4. babel

   babel 的处理流程是

   1. 先用词法分析，把源代码转换成 token
   2. 再用语法分析，把 token 词转换成 ast（抽象语法树）有一个[在线 bst](https://astexplorer.net/)可以在线看生成的 ast。在线写 babel 插件（@babel/parser）
   3. （@babel/traverse）接着就是**转换(Transform)**了，转换阶段会对 AST 进行遍历，在这个过程中对节点进行增删查改。Babel 所有插件都是在这个阶段工作, 比如语法转换、代码压缩。
   4. 代码生成，把 ast 转换成新的可运行的代码（@babel/generator）

   babel 执行的需要 babel/cli，cli 依赖 babel/core。

   插件在预设前运行。

   插件的执行顺序是从左到右

   ```js
   {
         "plugins": ["transform-decorators-legacy", "transform-class-properties"]
   }
   {
       "plugins": [
           ['xxxname',{"loose": true}]
       ]
   }
   ```

   如果加参数的话，就插件内数组加数组。

   自定义插件的话，就是处理自己想处理的那部分语言。

5. 如何用 babel 写一个自定义插件。

   进入 vistor 节点,比如我要替换 let 为 var，那就找到 VariableDeclaration 定义节点，然后进去后判断下 path.node.kind 是不是 let，如果是，改成 var 就可以了。具体的可以到 astexplorer 上学习一下。

   ```js
   visitor: {
   Identifier(path) {
       path.node.name = "_" + path.node.name;
   },
   VariableDeclaration(path) {
       if (path.node.kind == "let") {
       path.node.kind = "var";
       }
   },
   ```

   预设就是一堆插件的集合，预设的执行顺序是从右到左。最新的预设已经不需要什么 stage 了，就用的 env

   ```js
   //.babelrc
   {
       "presets": [
           [
               "@babel/preset-env",
               {
                   "useBuiltIns": "usage", // 用了这个可以按需引用用到的polyfill
                   "corejs": 3 //搭配使用的
               }
           ]
       ],
       "plugins": [
           "@babel/plugin-transform-runtime" // 用了这个可以节省很多重复的代码
       ]
   }
   ```

6. webpack

   webpack 主要分

   - entry: 入口，定义入口文件位置
   - output: 输出，定义输出文件
   - loader: 模块转换器，（和 babel 的交互就是通过 babel-loader）
   - 插件(plugins)

   ```js
   //webpack.config.js
   module.exports = {
       module: {
           rules: [
               {
                   test: /\.jsx?$/,
                   use: ['babel-loader'],
                   exclude: /node_modules/ //排除 node_modules 目录，也可以用include,就是包含哪些文件夹。
               }
           ]
       }
   }
   ```

   npm init -y，可以快速的创建一个 packge.json 文件

7. csr ssr spa

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

8. 返回拦截

   返回劫持弹窗，我们的项目的路由不是 react-router，是我们老大自己实现的一个，所以更没有`prompt`，但是好在他在`navigation`返回的时候，判断`isback`的时候，添加了一个事件

   `beforeback`事件，如果触发事件，会执行回调函数并忽略这次`hashchange`。就是它的`historys`数组不操作。并且调回当前`url`。

   现在事件有了，但是它的这个触发需要前面有一张页面，否则在微信打开就会直接退出。

   由于需要在首页，以及一个填写页需要返回劫持。

   那么问题来了，如果单纯的是在一个身份证填写页加返回劫持是好加的，因为这个时候他前面是有页面的。

   并且，身份证填写页面前页是一个支付下单页，是一个公共的，不属于我们应用下的，页就是说，当他进我的身份证页面的时候，是重新刷新所有页面的。

   加上首页页需要。
   所以我加了一个中间页。由这个中间页跳转到首页，由这个中间页跳转到身份证填写页。

   因为是一个通用的中间页，所以需要把首页或者是身份证页路由参数带上去。我的这个中间页接收三个参数。

   go = -n, 比如身份证页，返回的时候，需要把之前的路由清掉的，否则就会跳到支付页，再买一次。默认是-1

   timestamp，一个时间戳，用于记录当前这个中间页进来的时间节点，做缓存使用

   nextRoute，要跳转的目标页面。

   到了中间页后，我会先去我存的 session，然后获取当前的 historylen，应用里的。第一次进来肯定是没有的。所以我会存取时间戳和当前的 history.length，并跳到目标页。

   然后再返回的时候，回到中间页，会再抓取当前的 session 记录，这个时候能抓到了就删除它，然后判断当前的 historylen 是几，如果是 1，代表它是 1，代表它是第一张页面，会尝试关闭 webview

   比如你在微信，或者是 APP 里
   微信的话调用 window.WeixinJSBridge.call('closeWindow')。这里还要坑，这里微信的 js 加载可能会稍慢的情况下，直接返回就会无法退出微信，所以要轮训，超时设置 5s，100s 一次。

   如果是 APP 里的话，调用我们 native 提供的方法。

   如果不是 1 的话，说明前面还有页面，直接 back

   然后因为我们主客里面，手势返回也是可以的，但是在主客上，如果通过手滑的操作方式，history.length 不会被减掉，也就不会为 1.所以就会导致到了最前面那个页面，点击确定的时候，history.back 关不掉 webview。

   所以需要延迟 500ms 后关闭 webview。

   然后这里还有一个坑，就是我们的支付中间页，如果你不支付的话，它不会直接返回，而是一样和支付成功一样，跳 callback 页

   所以加一个支付中间页，然后判断支付状态，如果支付成功的话，跳拦截中间页，并把 historylen 多加 1，因为从身份证页再返回就不能返回到首页了，要直接退出去。这里就特别魔幻。

   如果支付失败的话，直接 history.back 回首页的那个位置。

9. rn 热更新原理

   react-native 的程序实际上是原生的模块+JS 和图片资源模块，热更新，就是更新其中的 js 和图片资源。
   安卓程序把它名字命名为 zip 解压后可以清楚的看到其中的 bundle 文件和资源文件

   热更新又分为全量更新和增量更新。
   全量更新是直接去服务器抓取你上传的`ppk`文件，下载下来，直接覆盖本地的`ppk`文件。
   增量更新是使用了`bsdiff`算法，用来比对两者`bundle`之间的区别，然后只修改不一样的地方。
   启动程序的时候，会发一个请求给服务器，带上自己当前`app`的`key`值。服务端会判读两次上传的包的异同来决定是否需要全量热更新还是增量热更新，如果是全量热更新会返回一个`downloadurl`，这个`url`就是自己在 react-native-update 后台配置的那个下载的 url。手机会下载整个 bundlejs 下来完成全量热更新。
   如果是增量热更新的话，会返回一个 pdiffUrl，拿到这个 url 下载下来的就是增量数据，然后客户端进行数据合并完成增量热更新。

10. rn im 的问题
    [im 问题链接](https://segmentfault.com/n/1330000011795138)
    发送图片的宽高比问题

    ```js
    // radio进来的就是 宽 / 高
    const measure = (radio) => {
        const baseW = winWidth / 2;
        // 这里的比例也有限制，不可能无限按原图比例，所以就要有边界值。
        const mradio = radio < 0.5 ? 0.5 : radio > 2 ? 2: radio;
        // 如果图片很高，宽一点点，比如长图。那不可能给他展示那么高，就要有一个限制。
        // 高就是这个限制，然后根据比例算它的宽
        if(mradio < 1) {
            width = baseW * mradio;
            height = baseW;
        }
        // 如果图片很扁，那宽按基本来，高按照比率来。
        else {
            width = baseW;
            height = baseW / mradio;
        }

        // 图片符合规范，按原有比例来即可。
        return {
            width: Math.ceil(width),
            height: Math.ceil(height)
        }
    }
    ```

11. rn flatlist 将屏幕外的视图组件回收，达到高性能的目的。

12. 调试技巧...

    1. element 是可以 copy 的
    2. console.log('%c this is a message','color:#f20;') 可以输入带颜色的 log,自己在 vscode 里自定义个预设片段就可以了。
    3. 点到 element，直接点 h 就可以隐藏，不需要直接 delete 掉了
    4. command + 上下可以直接移动 element
    5. 阴影这样的可以直接在页面上调，直接点击样式，就唤起弹窗，快速调试

13. 调试文字样式 debug， document.designModel = 'on'

    把这个属性在控制台打上后，可以直接在页面上修改对应的文字，方便看省略号或者是换行之类的效果，不用到 element 里去改。

14. 监控错误，打点上报，捕获异常。

    <b>监控性能</b>

    - MutationObserver 可以监控 dom 变化。
    - PerformanceObserver

    ```js
    const observer = new PerformanceObserver(performanceCallBack);
    observer.observe({entryTypes: ['paint', 'resource']});
    observer.disconnect();
    ```

    为什么会有 disconnect 方法？长时间持续观察性能数据，是一个比较消耗性能的行为。因此，最好在“合适”的时间，停止观察，清空对应 buffer，释放性能。

    `observer.takeRecords();`

    callback 接收两个参数，一个是 performancelist，一个是 observer,list.getEntries().forEach()就可以对每个监控的值的时间抓取，并进行处理。

    它本身的优势就是简便

    如果用 performance.mark，要写不少代码去各种记录，判断，并且实际上入侵了代码，而且如果要不停的记录的话，就要不停的调用几率函数，实在麻烦。

    <b>捕获异常</b>

    - 在一些可能会出错的地方使用 try catch
    - 在全局就可以使用 window.onerror 来监听
    - 但是，事件触发默认是冒泡阶段，所以如果想知道是哪个 js 或者 css 报错的话，可以把阶段换成捕获阶段
    - 而且跨域的情况下，window.onerror 是无法捕获的，不过用 SPA 就一个 js 正常不用考虑。不过遇到这样的情况，可以在那些三方 js 里 script 标签上加入 crossorigin="anonymous"这个标签，代表支持跨域。同时，服务端也要设置 Access-control-allow-orgin 的
    - react16 的 Error Boundary，可以处理子组件的渲染错误，避免渲染错误导致的 crash，react 生命周期里的 componentDidCatch，getDerivedStateFromError，后者可以在错误发生时降级处理。前者可以日志记录。

    ```js
    static getDerivedStateFromError(error) {
            render 里在根据这个来降级
        return { hasError: true };
    }
    ```

    非类组件可以 HOC 包装一下。对于类组件可以装饰器一下。

    <b>打点上报</b>

    用 new Image().src = '服务器地址，带参数'，这样方便，而且也不存在跨域的问题，不需要响应。可以给它包一个 requestIdlecallback。这个 imgae 标签最好挂在 window 对象上，防止还没打出去就被回收了。

    ```js
    var data = JSON.stringify({
        name: 'Berwin'
    });

    navigator.sendBeacon('/haopv', data)
    ```

    使用 beacon 上报的话，默认是 post，不能修改，这个是利用原生的方法

    信标请求优先避免与关键操作和更高优先级的网络请求竞争。

    信标请求可以有效地合并，以优化移动设备上的能量使用。

    保证页面卸载之前启动信标请求，并允许运行完成且不会阻塞请求或阻塞处理用户交互事件的任务。

    现在最新的标准里，其实可以利用 fetch，然后二参里设置 keep-alive 为 true，说这个可以替代 sendBeacon，这个限制是 64KB
    这样在页面关闭的时候，照样能发送出去。如果没这个参数，可能会停掉。
    window.onunload = function() {
    fetch('/analytics', {
    method: 'POST',
    body: "statistics",
    keepalive: true
    });
    };

15. 前端模块化

    [这个链接将的浅显易懂](https://juejin.cn/post/6844903712553435149)

    模块化规范主要有 AMD,CMD,CommonJS,ES6 模块

    AMD 规范的话 require.js 推行的比较好。

    ```js
    <script data-main="vender/main" src="vender/require.js"></script>
    main.js里通过require(['mo1','mo2'],function(mod1, mod2) {
    });
    ```

    小模块通过 define,return 的方式完成定义导出。主要就是定义 define 应该怎么写。

    CMD 规范的话，sea.js 推行的比较好。

    `seajs.use("./vender/main");`
    一样是 define 函数，不过引入模块是 require,导出的话使用 module.exports。

    CMD 推崇依赖就近，就是 require 到了再执行。而 AMD 的话推崇依赖前置。这样的话就是先加载完所有模块再执行代码。

    服务端的话有 CommonJS 规范，这里就不需要 define 了。就是正常的 require 和 module.exports。也是依赖就近。

    CommonJS 规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。AMD 规范则是非同步加载模块，允许指定回调函数。因为浏览器是要从服务器加载模块，所以必须采用非同步模式。

    ES6 模块的话，script 引入的时候 type 要改成 module，这样 import，export 就能识别。

    CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。也就是说，commonjs 模块输出的值并不影响内部变化，而 import 是动态引用，所以会跟着变。说白了，就是 es6 是编译的时候就已经确定好了所有的了，就把它当一个文件来看就好了

    CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

    BABEL 的话还是会把 ES6 转化成类似 COMMONJS 规范的代码。

    遇到循环引用的话

    - CommonJS 模块是加载时执行，即脚本代码在 require 时就全部执行。一旦出现某个模块被“循环加载”，就只输出已经执行的部分，没有执行的部分不会输出。
    - 而 ES6 的话模块加载是在编译时做的，也就是在编译阶段确定好模块的依赖关系，而不是在运行阶段。
    - 这样的结果就是 CommonJS 规范可能因为循环引用而找不到对应函数发生报错，而 es6 不会。

16. 听过 Style-components 吗？

    我们目前使用的是 css namespace，公共的写在 common 里

    - namespace 以页面为外层，各个模块为一层,实际上很少会有冲突的情况。

    - styled-components 属于 cssinjs，css 本身就是用 js 来写，相当于一个包装组件，对 css 组件拆分来说很不错，对于语义化来说更方便，而且 cssjs 可以传 props，非常的强大，只是我们老大不喜欢，所以也就用不了

    ```js
    export const HeaderWrapper = styled.div`
    z-index: 1;
    position: relative;
    height: 56px;
    border-bottom: 1px solid #f0f0f0;
    `;
    <HeaderWrapper>
        <div>header</div>
    </HeaderWrapper>
    ```

    - css modules，把对应的 css 文件引入成为对象，然后在 div 上的时候，写成 styles.xxx，webpack 配置一下 css-loader 的 options，会去自动添加一串 hash。

17. 路由守卫怎么做的

    包装一个方法，跳转的时候先进这个方法。

    在这个方法里，获取用户信息。

    如果没有获取到，说明没有登陆，await 登陆弹框或者是跳转到登陆页面。

    如果获取到了，比如是商家后台页面的话，根据用户权限判断，如果权限组里有这个路由名称，就可以跳，否则就跳 404。

    假如是通过 url 直接输入的，可以给每一个页面外面包装一个路由授权组件，在组件里调用上述的方法，好像也可以哦。

18. 二维码扫码登陆原理

    首先，二维码本身就是一个 url，并且包含这个页面当前的唯一 token,用于标识是哪张页面点进了二维码登陆的页面。
    在手机端，比如微信，那么我扫码后，会跳转到这个登录确认的页面，并且把我的个人信息及唯一 token 发送给服务端，然后服务端会标记已扫码。
    接下来，点击确认后，服务端会标记已确认，然后下发用户信息。

    在 PC 端，轮训去找服务端问，用户是否扫码，如果已经扫码了，这时候接口应该返回待确认的字段，如果点击确认后，再请求这个接口，服务端会吐出已确认，并且应该会种 cookie，然后重定向到首页，完成登陆。

19. 懒加载怎么实现

    - 第一个方案：
      使用 IntersectionObserver 可以做一个。它的回调接受两个参数，一个是 IntersectionObserverEntry 数组，一个是 obsever 自己

      ```js
      var observer = IntersectionObserver(callback, {
          root: document.getsxxx,
          rootMargin: '0px',
          threshold: [0.5];
      });
      imgs.forEach((img)=> {
          observer.observe(img);
      });

      ```

      等图片滚到屏幕中间 0.5 的时候，触发 callback，就可以在 callback 里让它的 data-src 变成 src,然后 unobserver 掉。

    - 第二个方案：
      - 监听页面的滚动事件
      - 获取对应图片距离顶部的高度 offsetTop img.offsetTop
      - 获取屏幕显示高度 screenH document.body.clientHeight
      - 获取滚动的距离 scrollTop document.documentElement.scrollTop
      - 判断 offsetTop < scrollTop + screenHeight.代表它出现了。
    - 第三个方案：
      不需要 scrollTop，直接把上面的 offsetTop 改成 img.getBoundingClientRect().top 对比 screenH 即可

20. preact 源码阅读

    preact 实现 hook 是数组的方式
    preact 没有事件系统，直接用的浏览器的

21. 你知道单点登录吗？如何实现呢？

    如果是同域名下的，直接用 cookie 就可以了，如果是在一个大域名下的不同子域名，可以到大域名下去登录，把 cookie 存在父域名下，这样所有子域名就可以获得到这个 cookie。

    如果是不同域名的，可以走一个中间 server，访问 A 页面，判断 A 页面是否有 cookie，如果有的话，直接请求获取用户信息。如果没有的话，判断是否需要强制登录，如果需要的话，跳转到 Server 下，并带上这个回调页面。然后在那个 server 下登录。登录好了后，那个页面会下发一个 token,并且重定向到 A 页面，然后 A 页面会获取这个 token，浏览器的服务器会验证这个 token 是否正确，如果正确的话，你就登录成功并存下服务端给你的新 cookie。这个时候你再访问 B 页面，B 页面会跳转到 Servcer 下，server 发现你已经有自己的 cookie 了，直接给你下发一个 token 并重定向回 B 页面。但是你要说 B 页面刷新了没有跳转直接就变成登录的话，他怎么知道我已经在别处登录过了呢？难道根据同 ip 同物理地址生成一个物理 id 吗？

22. RN 原理是什么

    JS 的话内置一个 javascript core，安卓的话使用 webkit.org.jsc.cso
    rn 会把 js 编译成一个 bundle 文件，和 webpack 一样，如果是原生的会通过 bridge 调用方法。
    ios 和安卓对于 rn 来说，是提供一个壳，并且提供了一些原生方法。
    rn 项目下会有一个 native_modules，通过这个模块可以调用原生方法。

23. MVC， MVP, MVVM

    MVC
    model, view, controller。

    mvc 里是 view 监听更新事件，model 处理完了后会通知更新事件。model 对于其它无感知的。逻辑分离。view 比较麻烦
    MVP
    model, view, p
    view 点击完了 =》 p, p 控制 model。监听改到了 p 层，由 p 层触发去改版 View。p 作为新的 controller，统一处理。以 p 为核心。p 就比较麻烦了
    MVVM
    viewmodel。controller。model。
    model 改了动 view，view 改了动 model。就是 vue 那种。我们现在分的层也类似这样。

24. 手写一个双向绑定
    vue.js
25. nginx 知识点
26. 骨架屏实现方案
27. 代码生成技术文档
28. 如果一个 tab 锚点，它对应的内容，是懒加载的，也就是说，我再点击这个锚点的时候，它只有一个 container 的话，我如何正确的锚到那里去呢？

    1. 初始的时候，发现，点击直接跳转过去的时候，会出现里面的图文加载，导致的内容撑开
       然后我在电脑上试的时候，发现，如果把 timeout 设置为 0 的话，安卓一些比较不错的手机，并不会锚点错位。
       但是一旦我点击过了之后，后续再点锚点的话，是不会有问题的，所以把这个 timeout0 限制为第一次
    2. 结果还是会有问题，一些低端的手机并没有任何用处，于是我想到的是当滚动完毕的之后，再次矫正一次，也就是说滚动到目的地了，再滚动一次，至少这会会再取一次位置吧。但是结果是，滚动到目的地后，有点时候图片才开始加重，这样做并没有实际的效果。
    3. 使用 MutationObserver，去监控对应的离屏锚点模块，是否发生变化，一旦发生变化，再次矫正锚点位置，并且设置一个超时时间，超过这个矫正超时时间就不用管了，并且，添加用户手势，一旦用户摸了屏幕，oberser.disconnect。(隐藏缺陷就是会来回闪)
    4. 使用了这个方法后，大多数机型表现正常，但是依然有部分机型不好，所以只能从根本上来解决，就是当第一次点击锚点的时候，也就是 scrollto 到对应位置的这段时间，锁定懒加载，只有滚动结束后，才解放懒加载，这样确实解决了问题，但是衍生出一个问题，就是往回滑动的时候，会触发加载，导致图片框框往下跑，所以呢，需要再加一个判断，默认给这个内容的容器限制在一个高度，然后判断这个容器的底部是否高于屏幕的地步，而当这个容器的底部，再碰到屏幕底部的时候，解开它的高度，这个时候图片就会框框的加载出来了。这样的话，我用户已经化上去了，下面再加载就不会造成当前的视窗抖动了。/ 返回滑的时候不触发懒加载，必须正滑并且在视口内，然后才触发，而且默认只有一张图片，没有懒加载，其他图片高度为 0。
    5. 还有一个方案，就是等图片加载完后，再跳过去。

    ```js
    await Promise.all([].map.call(imgs, (img) => {
            return img.src && img.complete
                ? true
                : (img.__load_promise__ || (img.__load_promise__ = new Promise((resolve) => {
                    var isOk = false;
                    var ok = () => {
                        if (!isOk) {
                            isOk = true;
                            resolve();
                            img.onerror = img.onload = img.__load_promise__ = null;
                        }
                    };
                    img.onerror = img.onload = ok;
                    if (autoLoadLazyImage) {
                        var dataSrc = img.getAttribute('data-src');
                        if (dataSrc) {
                            img.src = dataSrc;
                            img.style.opacity = 1;
                            img.removeAttribute('data-src');
                        }
                    }
                    if (img.complete) {
                        ok();
                    } else {
                        setTimeout(ok, 3000);
                    }
                })));
        }));
    ```
29. SWR
    [原理分析](https://zhuanlan.zhihu.com/p/93824106)
    [中文文档](https://swr.vercel.app/zh-CN)
    特点
    - 相当于封装了fetch，可以自动不断的获取最新的数据流
    - 帮助你更好的完成了请求缓存，内置缓存和重复请求去除
    - 分页和滚动位置恢复
    - 聚焦是重新验证，网络恢复时重新验证，支持Suspense
    - 获取数据的时候，非常简单，简易
