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

3. 什么是双向绑定，什么是单向绑定，区别是什么？

   双向绑定，就是数据驱动 UI，UI 的改变，比如用户输入，也直接改变数据，写的不得当的话，很难管理这些数据。你也不知道从哪里被改变了。

   数据(model)变化主动触发 ui（view）变化，同时 view 变化主动触发数据变化

   而单向数据流，就是通过 setstate 这样的数据驱动，改变数据后，驱动 UI 改变，而 UI 点击，比如通过回调 onChange。这样的好处是数据易于管控。

4. redux 对比 mobx

   两者对比:

   - redux 将数据保存在单一的 store 中，mobx 将数据保存在分散的多个 store 中
   - redux 使用 plain object 保存数据，需要手动处理变化后的操作；mobx 适用 observable 保存数据，数据变化后自动处理响应的操作
   - redux 使用不可变状态，这意味着状态是只读的，不能直接去修改它，而是应该返回一个新的状态，同时使用纯函数；mobx 中的状态是可变的，可以直接对其进行修改
   - mobx 相对来说比较简单，在其中有很多的抽象，mobx 更多的使用面向对象的编程思维；redux 会比较复杂，因为其中的函数式编程思想掌握起来不是那么容易，同时需要借助一系列的中间件来处理异步和副作用
   - mobx 中有更多的抽象和封装，调试会比较困难，同时结果也难以预测；而 redux 提供能够进行时间回溯的开发工具，同时其纯函数以及更少的抽象，让调试变得更加的容易

5. immutable 的特点是什么，它的优势是什么，对比 immer 呢？

   当我想在对 react 组件进行性能优化时，需要监测 state 或 props 的变化来判断是否 render，而怎么监测变化=>用浅比较，但浅比较存在更新对象属性时引用没变的问题，然而深拷贝的话浪费性能不说，万一只改了一个属性，亏，所以只要能解决这个问题，浅比较依然是好方案，因此 immutable 的出现解决的就是有变化就返回新引用，故而浅比较+immutable 就是性能优化的利器，然后后面出现的 Immer 是比 immutable 更好的方案

   特点：
   为了避免像 deepCopy 一样 把所有节点都复制一遍带来的性能损耗，Immutable 使用了 Structural Sharing（结构共享），即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享。请看下面动画
   ![immutable](https://user-gold-cdn.xitu.io/2019/6/4/16b1e68c06d12407?imageslim)

   其内部使用了 Trie(字典树) 数据结构, Immutable.js 会把对象所有的 key 进行 hash 映射，将得到的 hash 值转化为二进制，从后向前每 5 位进行分割后再转化为 Trie 树。

   缺点

   1. 容易被滥用 通过 toJS 转化为正常的 js 数据结构,这个时候新旧 props 就永远不会相等了,就导致了大量重复渲染,严重降低性能。
   2. API 不友好，使用不方便
   3. 文件比较大。

   而 Immer 呢,是通过 proxy 来做的，性能很好

   - 在调用原对象的某 key 的 getter 的时候
   - 如果这个 key 已经被改过了则返回 copy 中的对应 key 的值，如果没有改过就为这个子节点创建一个代理再直接返回原值。
   - 调用某 key 的 setter 的时候，就直接改 copy 里的值。
   - 如果是第一次修改，还需要先把 base 的属性和 proxies 的上的属性都浅拷贝给 copy。
   - 同时还根据 parent 属性递归父节点，不断浅拷贝，直到根节点为止。比如你修改的是一个属性下很远的属性，那么这条链条下的都需要浅拷贝。

6. 为什么用 React + mobx？

   React 和 Vue 有许多相似之处，它们都有：

   - 使用 Virtual DOM
   - 提供了响应式 (Reactive) 和组件化 (Composable) 的视图组件。
   - 将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库。
   - React 比 Vue 有更丰富的生态系统。

   确实，mobx 的实现原理类似于 vue 的数据双向绑定，用了这个，可以让 react 的数据管理一样舒服，而且又能享受到 jsx 的快感，包括不限于 hooks

   虽然用了 Mobx,但是比如修改数据的时候，还是通过一个文件下的回调，然后完成数据变更。

7. 返回拦截

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

8. rn 热更新原理

   react-native 的程序实际上是原生的模块+JS 和图片资源模块，热更新，就是更新其中的 js 和图片资源。
   安卓程序把它名字命名为 zip 解压后可以清楚的看到其中的 bundle 文件和资源文件

   热更新又分为全量更新和增量更新。
   全量更新是直接去服务器抓取你上传的`ppk`文件，下载下来，直接覆盖本地的`ppk`文件。
   增量更新是使用了`bsdiff`算法，用来比对两者`bundle`之间的区别，然后只修改不一样的地方。
   启动程序的时候，会发一个请求给服务器，带上自己当前`app`的`key`值。服务端会判读两次上传的包的异同来决定是否需要全量热更新还是增量热更新，如果是全量热更新会返回一个`downloadurl`，这个`url`就是自己在 react-native-update 后台配置的那个下载的 url。手机会下载整个 bundlejs 下来完成全量热更新。
   如果是增量热更新的话，会返回一个 pdiffUrl，拿到这个 url 下载下来的就是增量数据，然后客户端进行数据合并完成增量热更新。

9. rn im 的问题
   [im 问题链接](https://segmentfault.com/n/1330000011795138)
   发送图片的宽高比问题

   ```js
   // radio进来的就是 宽 / 高
   const measure = radio => {
     const baseW = winWidth / 2;
     // 这里的比例也有限制，不可能无限按原图比例，所以就要有边界值。
     const mradio = radio < 0.5 ? 0.5 : radio > 2 ? 2 : radio;
     // 如果图片很高，宽一点点，比如长图。那不可能给他展示那么高，就要有一个限制。
     // 高就是这个限制，然后根据比例算它的宽
     if (mradio < 1) {
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
     };
   };
   ```

10. rn flatlist 将屏幕外的视图组件回收，达到高性能的目的。

11. 调试技巧...

    1. element 是可以 copy 的
    2. console.log('%c this is a message','color:#f20;') 可以输入带颜色的 log,自己在 vscode 里自定义个预设片段就可以了。
    3. 点到 element，直接点 h 就可以隐藏，不需要直接 delete 掉了
    4. command + 上下可以直接移动 element
    5. 阴影这样的可以直接在页面上调，直接点击样式，就唤起弹窗，快速调试

12. 调试文字样式 debug， document.designModel = 'on'

    把这个属性在控制台打上后，可以直接在页面上修改对应的文字，方便看省略号或者是换行之类的效果，不用到 element 里去改。

13. 监控错误，打点上报，捕获异常。

    <b>监控性能</b>

    - MutationObserver 可以监控 dom 变化。
    - PerformanceObserver

    ```js
    const observer = new PerformanceObserver(performanceCallBack);
    observer.observe({ entryTypes: ["paint", "resource"] });
    observer.disconnect();
    ```

    为什么会有 disconnect 方法？长时间持续观察性能数据，是一个比较消耗性能的行为。因此，最好在“合适”的时间，停止观察，清空对应 buffer，释放性能。

    `observer.takeRecords();`

    callback 接收两个参数，一个是 performancelist，一个是 observer,list.getEntries().forEach()就可以对每个监控的值的时间抓取，并进行处理。

    它本身的优势就是简便

    如果用 performance.mark，要写不少代码去各种记录，判断，并且实际上入侵了代码，而且如果要不停的记录的话，就要不停的调用几率函数，实在麻烦。

    <b>捕获异常</b>

    - 在一些可能会出错的地方使用 try catch
    - 在全局就可以使用 window.onerror 来监听，通过 window.onerror 事件，可以得到具体的异常信息、异常文件的 URL、异常的行号与列号及异常的堆栈信息，再捕获异常后，统一上报至我们的日志服务器。
      ```
      window.onerror = function(errorMessage, scriptURI, lineNo, columnNo, error) {
          console.log('errorMessage: ' + errorMessage); // 异常信息
          console.log('scriptURI: ' + scriptURI); // 异常文件路径
          console.log('lineNo: ' + lineNo); // 异常行号
          console.log('columnNo: ' + columnNo); // 异常列号
          console.log('error: ' + error); // 异常堆栈信息
          // ...
          // 异常上报
      };
      throw new Error('这是一个错误');
      ```
      ![tu](https://user-gold-cdn.xitu.io/2018/7/29/164e673466b32bf3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
    - 但是，事件触发默认是冒泡阶段，所以如果想知道是哪个 js 或者 css 报错的话，可以把阶段换成捕获阶段
    - 而且跨域的情况下，window.onerror 是无法捕获的，不过用 SPA 就一个 js 正常不用考虑。不过遇到这样的情况，可以在那些三方 js 里 script 标签上加入 crossorigin="anonymous"这个标签，代表支持跨域。同时，服务端也要设置 Access-control-allow-orgin 的
    - try…catch 单点捕获
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
      name: "Berwin"
    });

    navigator.sendBeacon("/haopv", data);
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

14. 前端模块化

    [这个链接将的浅显易懂](https://juejin.cn/post/6844903712553435149)

    模块化规范主要有 AMD,CMD,CommonJS,ES6 模块

    AMD 规范的话 require.js 推行的比较好。

    ```js
    <script data-main="vender/main" src="vender/require.js"></script>;
    main.js里通过require(["mo1", "mo2"], function(mod1, mod2) {});
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

15. 听过 Style-components 吗？

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
    </HeaderWrapper>;
    ```

    - css modules，把对应的 css 文件引入成为对象，然后在 div 上的时候，写成 styles.xxx，webpack 配置一下 css-loader 的 options，会去自动添加一串 hash。

16. 路由守卫怎么做的

    包装一个方法，跳转的时候先进这个方法。

    在这个方法里，获取用户信息。

    如果没有获取到，说明没有登陆，await 登陆弹框或者是跳转到登陆页面。

    如果获取到了，比如是商家后台页面的话，根据用户权限判断，如果权限组里有这个路由名称，就可以跳，否则就跳 404。

    假如是通过 url 直接输入的，可以给每一个页面外面包装一个路由授权组件，在组件里调用上述的方法，好像也可以哦。

17. 二维码扫码登陆原理

    首先，二维码本身就是一个 url，并且包含这个页面当前的唯一 token,用于标识是哪张页面点进了二维码登陆的页面。
    在手机端，比如微信，那么我扫码后，会跳转到这个登录确认的页面，并且把我的个人信息及唯一 token 发送给服务端，然后服务端会标记已扫码。
    接下来，点击确认后，服务端会标记已确认，然后下发用户信息。

    在 PC 端，轮训去找服务端问，用户是否扫码，如果已经扫码了，这时候接口应该返回待确认的字段，如果点击确认后，再请求这个接口，服务端会吐出已确认，并且应该会种 cookie，然后重定向到首页，完成登陆。

18. 懒加载怎么实现

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

19. preact

    preact 实现 hook 是数组的方式
    preact 没有事件系统，直接用的浏览器的

20. 你知道单点登录吗？如何实现呢？

    1. 如果是同域名下的，直接用 cookie 就可以了。

    2. 如果是在一个大域名下的不同子域名，可以到大域名下去登录，把 cookie 存在父域名下，这样所有子域名就可以获得到这个 cookie。

    3. 如果是不同域名的，可以走一个中间 server，访问 A 页面，判断 A 页面是否有 cookie1

       如果有的话，直接请求获取用户信息。

       如果没有的话，说明没有登录，重定向到 Server 下，并带上这个回调页面。

       然后 sever 中间页判断用户是否有 cookie2

       如果中间页没有 cookie2，说明没有登录，它会重定向到登录页，然后登录后，就会拥有 Cookie2。也就是 TGC，然后重定向回 A 并且带上 ST，
       回到 A 页面后，拿上这个 ST 会去请求服务端，服务端拿到这个 ST 后，会去找这个 server 验证， 是不是你签发的，如果是的话，setCookie,A 页面登录成功。

       A 页面下次进来，由于拥有 cookie1，直接登录成功。

       如果中间页有 cookie2 的话，说明已经在中间 server 上登录过了，至于你是 A 过来的还是 B 过来的，无所谓，假设是 B 吧，直接重定向回 B 页面， 然后 url 上带一个 ST，
       回到 B 页面后，拿上这个 ST 会去请求服务端，服务端拿到这个 ST 后，会去找这个 server 验证， 是不是你签发的，如果是的话，setCookie,B 页面登录成功。至此，单点登录就完成了。

       ![tu](https://user-gold-cdn.xitu.io/2020/1/5/16f74f3f11a6fbad?imageslim)

21. RN 原理是什么

    JS 的话内置一个 javascript core，安卓的话使用 webkit.org.jsc.cso
    rn 会把 js 编译成一个 bundle 文件，和 webpack 一样，如果是原生的会通过 bridge 调用方法。
    ios 和安卓对于 rn 来说，是提供一个壳，并且提供了一些原生方法。
    rn 项目下会有一个 native_modules，通过这个模块可以调用原生方法。

22. MVC， MVP, MVVM

    MVC
    model, view, controller。

    mvc 里是 view 监听更新事件，model 处理完了后会通知更新事件。model 对于其它无感知的。逻辑分离。view 比较麻烦
    MVP
    model, view, p
    view 点击完了 =》 p, p 控制 model。监听改到了 p 层，由 p 层触发去改版 View。p 作为新的 controller，统一处理。以 p 为核心。p 就比较麻烦了
    MVVM
    viewmodel。controller。model。
    model 改了动 view，view 改了动 model。就是 vue 那种。我们现在分的层也类似这样。

23. 手写一个双向绑定
    vue.js
24. nginx 知识点
25. 骨架屏实现方案
26. 代码生成技术文档
27. 如果一个 tab 锚点，它对应的内容，是懒加载的，也就是说，我再点击这个锚点的时候，它只有一个 container 的话，我如何正确的锚到那里去呢？

    1. 初始的时候，发现，点击直接跳转过去的时候，会出现里面的图文加载，导致的内容撑开
       然后我在电脑上试的时候，发现，如果把 timeout 设置为 0 的话，安卓一些比较不错的手机，并不会锚点错位。
       但是一旦我点击过了之后，后续再点锚点的话，是不会有问题的，所以把这个 timeout0 限制为第一次
    2. 结果还是会有问题，一些低端的手机并没有任何用处，于是我想到的是当滚动完毕的之后，再次矫正一次，也就是说滚动到目的地了，再滚动一次，至少这会会再取一次位置吧。但是结果是，滚动到目的地后，有点时候图片才开始加重，这样做并没有实际的效果。
    3. 使用 MutationObserver，去监控对应的离屏锚点模块，是否发生变化，一旦发生变化，再次矫正锚点位置，并且设置一个超时时间，超过这个矫正超时时间就不用管了，并且，添加用户手势，一旦用户摸了屏幕，oberser.disconnect。(隐藏缺陷就是会来回闪)
    4. 使用了这个方法后，大多数机型表现正常，但是依然有部分机型不好，所以只能从根本上来解决，就是当第一次点击锚点的时候，也就是 scrollto 到对应位置的这段时间，锁定懒加载，只有滚动结束后，才解放懒加载，这样确实解决了问题，但是衍生出一个问题，就是往回滑动的时候，会触发加载，导致图片框框往下跑，所以呢，需要再加一个判断，默认给这个内容的容器限制在一个高度，然后判断这个容器的底部是否高于屏幕的地步，而当这个容器的底部，再碰到屏幕底部的时候，解开它的高度，这个时候图片就会框框的加载出来了。这样的话，我用户已经化上去了，下面再加载就不会造成当前的视窗抖动了。/ 返回滑的时候不触发懒加载，必须正滑并且在视口内，然后才触发，而且默认只有一张图片，没有懒加载，其他图片高度为 0。
    5. 还有一个方案，就是等图片加载完后，再跳过去。

    ```js
    await Promise.all(
      [].map.call(imgs, img => {
        return img.src && img.complete
          ? true
          : img.__load_promise__ ||
              (img.__load_promise__ = new Promise(resolve => {
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
                  var dataSrc = img.getAttribute("data-src");
                  if (dataSrc) {
                    img.src = dataSrc;
                    img.style.opacity = 1;
                    img.removeAttribute("data-src");
                  }
                }
                if (img.complete) {
                  ok();
                } else {
                  setTimeout(ok, 3000);
                }
              }));
      })
    );
    ```

28. SWR
    [原理分析](https://zhuanlan.zhihu.com/p/93824106)
    [中文文档](https://swr.vercel.app/zh-CN)
    特点

    - 相当于封装了 fetch，可以自动不断的获取最新的数据流
    - 帮助你更好的完成了请求缓存，内置缓存和重复请求去除
    - 分页和滚动位置恢复
    - 聚焦是重新验证，网络恢复时重新验证，支持 Suspense
    - 获取数据的时候，非常简单，简易

29. Taro 是什么?
    Taro 是一个开放式跨端跨框架解决方案，支持使用 React/Vue/Nerv 等框架来开发 微信 / 京东 / 百度 / 支付宝 / 字节跳动 / QQ 小程序 / H5 等应用。现如今市面上端的形态多种多样，Web、React Native、微信小程序等各种端大行其道，当业务要求同时在不同的端都要求有所表现的时候，针对不同的端去编写多套代码的成本显然非常高，这时候只编写一套代码就能够适配到多端的能力就显得极为需要。

30. Recoil
    这个是一个新出的状态管理库，facebook出的
    ```js
    function App() {
      return (
        <RecoilRoot>
          <CharacterCounter />
        </RecoilRoot>
      );
    }
    const textState = atom({
      key: 'textState', // unique ID (with respect to other atoms/selectors)
      default: '', // default value (aka initial value)
    });

    function TextInput() {
      const [text, setText] = useRecoilState(textState);

      const onChange = (event) => {
        setText(event.target.value);
      };

      return (
        <div>
          <input type="text" value={text} onChange={onChange} />
          <br />
          Echo: {text}
        </div>
      );
    }
    ```

    这样不同的组件都可以共享数据。通过这个 useRecoilState