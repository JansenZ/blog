1. 性能优化的方式
    <details open>

    HTTP方面
    1. http 网络请求开启 gzip，可以压缩 HTTP 响应的 70%。这个要服务端配置一下，会增大 CPU 的开销去解压、压缩，Webpack 中 用 CompressionWebpackPlugin 插件开启 Gzip ,事实上就是为了在构建过程中去做一部分服务器的工作，为服务器分压。
       2.1 使用 CDN 缓存。dns 预解析，dns prefetch，可以预解析。script defer async 防止 js 阻塞。
    2. 使用 HTTP 强缓存，cache-control > expires。expire 里面写的是过期日期，是和本地电脑比的，而 cache-control 是过期时间段，所以 cache-control 更准。
    3. cache-control 值，public，本地和服务器都会缓存走强缓存，private，只有本地缓存走强缓存，no-cache，本地缓存，但是会绕过强缓存去协商。no-store 的话就直接绕过所有全部重新下载了
    4. 使用 HTTP 协商缓存，协商缓存本身数据也是存在本地的， Last-Modified（请求带上 If-Modified-Since），返回 304，但是如果改了文件名的话，last-modified 就找不到了，就会重新返回。所以还要一个 etag（请求带上 If-None-Match），两者共同配合完成 304.
    5. 体积不大的会放在 from memory cahce，比如 base64,小的 css，体积稍大会放 from disk cache。
    6. 还可以使用 service worker。
    7. 以上 http 的缓存，实际上现在多数都是后台网关缓存，走 redis。永远给我 200。
    8. 本地存储，cookie,storage。 cookie 里少放信息，因为会跟着 http 请求头跑，很浪费。如果本地存储需求量很大的话，比如你要实现一个 im 的话，可以用 indexDB,本地数据库

    WEBPACK
    1. webpack 构建优化，使用 include/exclude.
    2. Happypack 开启多线程
    3. 自带的 tree-shaking 移除无用代码
    4. 自带的 hosit-scoping，移除无用计算。
    5. 利用 import.then 进行懒加载拆分, 生成对应的hash.chunk.js，比如交易流程主要流程不要懒加载，但是一些用户点击率低的页面，通过懒加载的形式加载。
    6. babel 设置缓存 cacheDirectory:true

    React方面
    1. 采用服务端渲染，当然了，会加大服务端的消耗。
    2. react 本身的虚拟 dom，react fiber 计算 diff。（减少比对 dom 的成本）减少操作 dom。有效的减少回流和重绘。
    3. 利用 key 提升 diff 性能
    4. 利用 context 来减少中间组件的渲染
    5. 利用 shouldComponentUpdate 、 pureComponent 来做渲染优化
    6. 利用 immer 来做数据层面优化

    其他方面
    1. 图片也做好压缩，雪碧图, 小图使用 base64 可以减少请求，大图不能用 bas64，因为 base64 会膨胀到 4/3 大小，那时候省的 http 请求还不如膨胀的多。然后 svg 的话渲染成本比较高，而且对设计要求也比较高。
    2. webp 格式，前端处理的话，包装 src 函数，然后去 caniuse 维护一个浏览器支持的表，然后支持就用 webp 不支持直接把 webp 分割掉就可以了。
    3. webp 格式，后端处理的话，就是判断我图片过去的请求头 accept 里有没有 img/webp。有就说明我这浏览器支持，然后就吐给我 webp 的资源就可以了。比如 Chrome 就有，safari 就没有
    4. 比如图片给定好它的高度。也可以减少回流。offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、clientTop、clientLeft、clientWidth、clientHeight 这些属性的获取，都会触发回流。
    5. 不重要的类似日志打点这样的，放在 requestidlecallback
    6. 图片懒加载 intersectionobserver
    7. 防抖（搜索输入）、节流(scroll 监听)

2. 常见的设计模式
    <details open>

    我认为很多设计模式我们在不知道它的名字的时候，我们就已经在用它了，

    - 工厂模式

        批量创建对象
        当同一个构造函数，需要多次 new 的时候，就需要考虑是不是可以用 工厂模式 来批量的创建实例对象了

        `React.createElement` 就是工厂模式

        ```js
            // 某个需要创建的具体对象
            class Product {
                constructor (name) {
                    this.name = name;
                }
                init () {}
            }
            // 工厂对象
            class Creator {
                create (name) {
                    return new Product(name);
                }
            }
            const creator = new Creator();
            const p = creator.create(); // 通过工厂对象创建出来的具体对象
        }
        ```

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

        这个单例模式还可以改成惰性函数来修改。比如在类中使用的时候

        ```js
        var instance;
        class A {}
        A.getInstance = () => {
            instance = new A();
            A.getInstance = () => instance;
        };
        ```

    - 适配器模式

        就是通过包装，来解决兼容问题

        ```js
        class Plug {
            getName() {
                return "港版插头";
            }
        }

        class Target {
            constructor() {
                this.plug = new Plug();
            }
            getName() {
                return this.plug.getName() + " 适配器转二脚插头";
            }
        }

        let target = new Target();
        target.getName(); // 港版插头 适配器转二脚插头
        ```

    - 代理模式 proxy 呗

    - 装饰模式

        比如我们的商品详情页的 spucontroller

        ```js
        // 这个base就是装饰里的target
        const testMixin = Base =>
            class extends Base {
                // ...
            };

        @testMixin
        class spuController {
            // ...
        }
        ```

        这样的话，所有的组件逻辑写在自己的组件下，然后主 spu 下引用的所有方法都可以互相使用。对于一个页面逻辑非常复杂的情况下，非常方便

    - 职责链模式
      把一个复杂的链路 function 拆成若干个小的，然后连成一条链，知道有一个对象处理它为止。
      就像作用域链，原型链，事件冒泡一样。可以降低耦合度，职责更加的单一。

    - 组合模式优于继承模式
      继承的最大问题在于：无法决定继承哪些属性，所有属性都得继承。这样对于如何定义父类边界是非常值得考究的
      用组合的话，可以拼装，就可以避免这个问题。

3. 什么是双向绑定，什么是单向绑定，区别是什么？
    <details open>

    双向绑定，就是数据驱动 UI，UI 的改变，比如用户输入，也直接改变数据，写的不得当的话，很难管理这些数据。你也不知道从哪里被改变了。

    数据(model)变化主动触发 ui（view）变化，同时 view 变化主动触发数据变化

    而单向数据流，就是通过 setstate 这样的数据驱动，改变数据后，驱动 UI 改变，而 UI 点击，比如通过回调 onChange。这样的好处是数据易于管控。

4. redux 对比 mobx
    <details open>

    两者对比:

    - redux 将数据保存在单一的 store 中，mobx 将数据保存在分散的多个 store 中
    - redux 使用 plain object 保存数据，需要手动处理变化后的操作；mobx 适用 observable 保存数据，数据变化后自动处理响应的操作
    - redux 使用不可变状态，这意味着状态是只读的，不能直接去修改它，而是应该返回一个新的状态，同时使用纯函数；mobx 中的状态是可变的，可以直接对其进行修改
    - mobx 相对来说比较简单，在其中有很多的抽象，mobx 更多的使用面向对象的编程思维；redux 会比较复杂，因为其中的函数式编程思想掌握起来不是那么容易，同时需要借助一系列的中间件来处理异步和副作用
    - mobx 中有更多的抽象和封装，调试会比较困难，同时结果也难以预测；而 redux 提供能够进行时间回溯的开发工具，同时其纯函数以及更少的抽象，让调试变得更加的容易
    - 设计思想的不同, Redux 的编程范式是函数式的而 Mobx 是面向对象的；
    - 数据可变性的不同, Redux 是 immutable 的，每次都返回一个新的数据，而 Mobx 从始至终都是一份引用。因此 Redux 是支持数据回溯的；

5. immutable 的特点是什么，它的优势是什么，对比 immer 呢？
    <details open>

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

    用一张图来通俗的解释一下就是
    ![image](https://user-images.githubusercontent.com/17866433/111062431-a411ba80-84e3-11eb-8a26-666522c61559.png)

    在写数据的时候，也就是 setter

    - 如果这个 state 没有 copy 对象，说明它还没有被改过，先判断是否值一样，如果一样，说明前后一致，直接 return true
    - 如果值不一样，说明修改新值了，把要修改的值，更改到 copy 对象上。并且需要看这个值上级有没有被拷贝，如果没有，一路浅拷贝上去。
    - 如果有 copy 对象，直接把值赋给 copy 对象

    在取数据的时候，也就是 getter

    - 如果这个 target 有 copy ，那么取 copy 下的值
    - 如果没有，就说明没有用到，取原值

    以上解释仅限于解释这张图。因为具体写的时候，还要多级代理，所以另外说，可以参考 [easyimmer.js](https://zhenglin.vip/js/EasyImmer.js)
    分为 3 步，一步是处理 set,一步是处理 get,一步是处理这个 proxy 数据，因为我们代理的并不是原值，而是一个套值

    这个套值有 3 个属性 copy, base, parent

    写数据的时候

    ```js
     set(state, prop, value) {
       if (!state.copy) {
         // 如果没有拷贝，并且和原来的一样，不用管
         if (value === state.base[prop]) return true
         // 如果没有拷贝，但是是新的值，需要去标记了
         markChanged(state) // 标记就是浅拷贝，并且往上递进
       }
       // 有拷贝的情况下，改拷贝的值
       state.copy[prop] = value
       return true
     }
     function markChanged(state) {
       if (!state.copy) {
         state.copy = shallowCopy(state.base)
         if (state.parent) markChanged(state.parent)
       }
     }
    ```

    取数据的时候

    ```js
     get(state, prop) {
       // 这个用来取自己，不然没法取。
       if (prop === DRAFT_STATE) return state
       // 如果有拷贝
       if (state.copy) {
         const value = state.copy[prop]
         // 第一次进来，并且value还是个对象， 要遍历代理
         if (value === state.base[prop] && isObject(value)) {
           return (state.copy[prop] = createDraft(state, value))
         }
         return value
       }
       // 说明没有靠背，取原值
       const value = state.base[prop]
       return value
     }
    ```

    生成最后的数据的时候

    ```js
    function finalize(draft) {
        // 是否是多重对象，只有多重对象才能访问到 Symbol ，因为藏在get里，是代理到了的。
        if (isDraft(draft)) {
            const state = draft[DRAFT_STATE];
            // 获取copy和原值
            const { copy, base } = state;
            if (copy) {
                // 如果是copy说明它下面还有可能有多重对象，要都去解开。
                Object.entries(copy).forEach(([prop, value]) => {
                    // 如果相等，就是原始对象
                    if (value !== base[prop]) copy[prop] = finalize(value);
                });
                return copy;
            }
            return base;
        }
        // 不是多重对象或者是原值
        return draft;
    }
    ```

6. 为什么用 React + mobx？
    <details open>

    React 和 Vue 有许多相似之处，它们都有：

    - 使用 Virtual DOM
    - 提供了响应式 (Reactive) 和组件化 (Composable) 的视图组件。
    - 将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库。
    - React 比 Vue 有更丰富的生态系统。

    确实，mobx 的实现原理类似于 vue 的数据双向绑定，用了这个，可以让 react 的数据管理一样舒服，而且又能享受到 jsx 的快感，包括不限于 hooks

    虽然用了 Mobx,但是比如修改数据的时候，还是通过一个文件下的回调，然后完成数据变更。

7. 返回拦截
    <details open>

    返回劫持弹窗，我们的项目的路由不是 react-router，是我们老大自己实现的一个，所以更没有`prompt`，但是好在他在`navigation`返回的时候，判断`isback`的时候，添加了一个事件

    `beforeback`事件，如果触发事件，会执行回调函数并忽略这次`hashchange`。就是它的`historys`数组不操作。并且跳回当前`url`。具体可以参考 router.md 的一个小例子

    现在事件有了，但是它的这个触发需要前面有一张页面，因为我们是`hash`方案，否则在微信打开就会直接退出。

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

    然后再返回的时候，回到中间页，会再抓取当前的 session 记录，这个时候能抓到了就删除它，然后看这个 session 的值是不是 1，如果是 1，代表它是第一张页面，会尝试关闭 webview

    比如你在微信

    微信的话调用 `window.WeixinJSBridge.call('closeWindow')`。这里还有个坑，这里微信的 js 加载可能会稍慢的情况下，直接返回就会无法退出微信，所以要轮训，超时设置 5s，100ms 一次。

    如果是 APP 里的话，调用我们 native 提供的方法。

    如果不是 1 的话，说明前面还有页面，直接 back

8. rn 热更新原理
    <details open>

    react-native 的程序实际上是原生的模块+JS 和图片资源模块，热更新，就是更新其中的 js 和图片资源。
    安卓程序把它名字命名为 zip 解压后可以清楚的看到其中的 bundle 文件和资源文件

    热更新又分为全量更新和增量更新。
    全量更新是直接去服务器抓取你上传的`ppk`文件，下载下来，直接覆盖本地的`ppk`文件。
    增量更新是使用了`bsdiff`算法，用来比对两者`bundle`之间的区别，然后只修改不一样的地方。
    启动程序的时候，会发一个请求给服务器，带上自己当前`app`的`key`值。服务端会判读两次上传的包的异同来决定是否需要全量热更新还是增量热更新，如果是全量热更新会返回一个`downloadurl`，这个`url`就是自己在 react-native-update 后台配置的那个下载的 url。手机会下载整个 bundlejs 下来完成全量热更新。
    如果是增量热更新的话，会返回一个 pdiffUrl，拿到这个 url 下载下来的就是增量数据，然后客户端进行数据合并完成增量热更新。

9. rn im 的问题
    <details open>

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

11. rn webview 新闻 难点

12. 调试技巧...
    <details open>

    1. element 是可以 copy 的
    2. console.log('%c this is a message','color:#f20;') 可以输入带颜色的 log,自己在 vscode 里自定义个预设片段就可以了。
    3. 点到 element，直接点 h 就可以隐藏，不需要直接 delete 掉了
    4. command + 上下可以直接移动 element
    5. 阴影这样的可以直接在页面上调，直接点击样式，就唤起弹窗，快速调试
    6. 断点可以加条件，这样不必一直进这个断点，比如 for，判断 i==5 才进。

13. 调试文字样式 debug， document.designModel = 'on'

    把这个属性在控制台打上后，可以直接在页面上修改对应的文字，方便看省略号或者是换行之类的效果，不用到 element 里去改。

14. 监控错误，打点上报，捕获异常。
    <details open>

    [troy监控性能和错误](https://zhenglin.vip/js/troy.js)

    - 使用 `localstorage`，存储记录数据
    - 使用 `performance.timing.fetchStart || Date.now()`记录开始时间
    - 在 `onload` 和 `DOMContendLoaded` 的时候记录时间节点数据。
    - 在 `unload` 的时候，保存还未上报的数据到 `localstorage` 上
    - 记录数据本质上还是利用 this.records 的这样一个 Map 来存储数据, 如果 key 相同，会把值添加起来，给count++;
    - 发送数据的要求是队列里的长度超过 30 个或者 5s 后发送（都可以通过 options 配置）
    - 发送数据单个结构如下，数组包裹，然后 base64 编码发送
    ```js
    appName: "xxxx"
    hash: "#/xxxx"
    logMessage: "xxevent"
    logTime: "2021-04-25 09:30:08.645"
    perfData: 191201
    type: "perf"
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
    v: "1.0.0"
    // 如果是错误的type
    type: "fault"
    errorCol: 31227
    errorLine: 1
    errorStack: "TypeErrorxxxx"
    errorUrl: "xxxxx"
    ```
    - onload 的时候除了记录 onload 时间节点，还会根据performance基本的那些数据发送对应的性能数据。
    ```js
    this.record('domComplete', t.domComplete - t.domContentLoadedEventEnd);
    this.record('loadEvent', t.loadEventEnd - t.loadEventStart);
    this.record('unloadEvent', t.unloadEventEnd - t.unloadEventStart);
    this.record('request', request);
    this.record('domContentLoaded', domContentLoaded);
    ```

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

    **为什么用 1x1 的 gif 图呢？**

    1. 加载图片不需要操作 DOM，性能更好，不会阻塞页面，只需要 new Image， script 需要插入
    2. GIF 的最低合法体积最小（最小的 BMP 文件需要 74 个字节，PNG 需要 67 个字节，而合法的 GIF，只需要 43 个字节）

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
    ```js
    window.onunload = function() {
        fetch('/analytics', {
            method: 'POST',
            body: "statistics",
            keepalive: true
        });
    };
    ```

15. 前端模块化
    <details open>

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

16. 听过 Style-components 吗？
    <details open>

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

17. 路由守卫怎么做的
    <details open>

    包装一个方法，跳转的时候先进这个方法。

    在这个方法里，获取用户信息。

    如果没有获取到，说明没有登陆，await 登陆弹框或者是跳转到登陆页面。

    如果获取到了，比如是商家后台页面的话，根据用户权限判断，如果权限组里有这个路由名称，就可以跳，否则就跳 404。

    假如是通过 url 直接输入的，可以给每一个页面外面包装一个路由授权组件，在组件里调用上述的方法，好像也可以哦。

18. 二维码扫码登陆原理
    <details open>

    首先，二维码本身就是一个 url，并且包含这个页面当前的唯一 token,用于标识是哪张页面点进了二维码登陆的页面。
    在手机端，比如微信，那么我扫码后，会跳转到这个登录确认的页面，并且把我的个人信息及唯一 token 发送给服务端，然后服务端会标记已扫码。
    接下来，点击确认后，服务端会标记已确认，然后下发用户信息。

    在 PC 端，轮训去找服务端问，用户是否扫码，如果已经扫码了，这时候接口应该返回待确认的字段，如果点击确认后，再请求这个接口，服务端会吐出已确认，并且应该会种 cookie，然后重定向到首页，完成登陆。

19. 懒加载怎么实现
    <details open>

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

20. preact

    preact 实现 hook 是数组的方式
    preact 没有事件系统，直接用的浏览器的

21. 你知道单点登录吗？如何实现呢？
    <details open>

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

22. RN 原理是什么
    <details open>

    JS 的话内置一个 javascript core，安卓的话使用 webkit.org.jsc.cso
    rn 会把 js 编译成一个 bundle 文件，和 webpack 一样，如果是原生的会通过 bridge 调用方法。
    ios 和安卓对于 rn 来说，是提供一个壳，并且提供了一些原生方法。
    rn 项目下会有一个 native_modules，通过这个模块可以调用原生方法。

23. MVC， MVP, MVVM
    <details open>

    - MVC

        model, view, controller。

        mvc 里是 view 监听更新事件，model 处理完了后会通知更新事件。model 对于其它无感知的。逻辑分离。view 比较麻烦

    - MVP
      model, view, p
      view 点击完了 =》 p, p 控制 model。监听改到了 p 层，由 p 层触发去改版 View。p 作为新的 controller，统一处理。以 p 为核心。p 就比较麻烦了
    - MVVM
      viewmodel。controller。model。
      model 改了动 view，view 改了动 model。就是 vue 那种。我们现在分的层也类似这样。

24. 手写一个双向绑定

    [vue.js](https://zhenglin.vip/js/vue.js)

25. mobx 原理

    类似于vue的数据劫持

    [mobx](https://zhenglin.vip/js/mobx.js)

26. nginx 知识点
27. 骨架屏实现方案
28. 代码生成技术文档
29. 如果一个 tab 锚点，它对应的内容，是懒加载的，也就是说，我再点击这个锚点的时候，它只有一个 container 的话，我如何正确的锚到那里去呢？
    <details open>

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

30. SWR
    <details open>

    [原理分析](https://zhuanlan.zhihu.com/p/93824106)

    [中文文档](https://swr.vercel.app/zh-CN)

    特点

    - 相当于封装了 fetch，可以自动不断的获取最新的数据流
    - 帮助你更好的完成了请求缓存，内置缓存和重复请求去除
    - 分页和滚动位置恢复
    - 聚焦是重新验证，网络恢复时重新验证，支持 Suspense
    - 获取数据的时候，非常简单，简易

31. Taro 是什么?
    <details open>

    Taro 是一个开放式跨端跨框架解决方案，支持使用 React/Vue/Nerv 等框架来开发 微信 / 京东 / 百度 / 支付宝 / 字节跳动 / QQ 小程序 / H5 等应用。现如今市面上端的形态多种多样，Web、React Native、微信小程序等各种端大行其道，当业务要求同时在不同的端都要求有所表现的时候，针对不同的端去编写多套代码的成本显然非常高，这时候只编写一套代码就能够适配到多端的能力就显得极为需要。

32. Recoil
    <details open>

    这个是一个新出的状态管理库，facebook 出的

    ```js
    function App() {
        return (
            <RecoilRoot>
                <CharacterCounter />
            </RecoilRoot>
        );
    }
    const textState = atom({
        key: "textState", // unique ID (with respect to other atoms/selectors)
        default: "" // default value (aka initial value)
    });

    function TextInput() {
        const [text, setText] = useRecoilState(textState);

        const onChange = event => {
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

33. vite

    vite 是 vue 出的一个构建工具，开发时候用的 esm 原生模块，非常的快，生产用的 rollup，具体的不了解了，因为暂时不可能替代 webpack

34. JS bridge 原理是什么？
    <details open>

    [jsbridge原理实践](https://juejin.cn/post/6844904025511444493)

    有两种方式：

    - 注入 API

    注入 API 方式的主要原理是，通过 WebView 提供的接口，向 JavaScript 的 Context（window）中注入对象或者方法
    ```js
     // 安卓端
     public class InjectNativeObject { // 注入到JavaScript的对象
        private Context context;
        public InjectNativeObject(Context context) {
            this.context = context;
        }

        @JavascriptInterface
        public void quit() { // 退出app
            finish();
        }
    }
    webView.addJavascriptInterface(new InjectNativeObject(this), "NativeBridge");
    // 前端
    window.NativeBridge.quit();
    ```

    JavaScript 调用时，直接执行相应的 Native 代码逻辑，达到 JavaScript 调用 Native 的目的。

    - 拦截 URL scheme

    拦截 URL SCHEME 的主要流程是：Web 端通过某种方式（例如 iframe.src）发送 URL Scheme 请求，之后 Native 拦截到请求并根据 URL SCHEME（包括所带的参数）进行相关操作。

    回调的话，native 会执行 window.下你的方法，从而达成回调

    ```js
    var scheme = (function() {
        var schemeActions = [];
        var jsMessageIframe;

        function myScheme(scheme, content, callback) {
            schemeActions.push(callback);
            // 创建IFRAME
            if (!jsMessageIframe) {
                jsMessageIframe = document.createElement("iframe");
                jsMessageIframe.style.display = "none";
                document.body.appendChild(jsMessageIframe);
            }

            var schemeHeader = "qunarhy://";

            // 发送
            jsMessageIframe.src =
                schemeHeader +
                scheme +
                (content
                    ? "?content=" + encodeURIComponent(JSON.stringify(content))
                    : "") +
                (!!content ? "&" : "?") +
                "_=" +
                +new Date();
        }

        window.onMessage = window.jsOnMessage = function(options) {
            if (options) {
                var actions = schemeActions;
                if (actions && actions.length) {
                    actions.forEach(function(action) {
                        action(options.data);
                    });
                    schemeActions = [];
                }
            }
        };
        return myScheme;
    })();
    ```

    - 为什么选择 iframe.src 不选择 locaiton.href ？

    因为如果通过 location.href 连续调用 Native，很容易丢失一些调用。

35. IOS 键盘遮挡输入框遇到过没有？ 怎么解决
    <details open>

    - 可以使用 `document.activeElement.scrollIntoViewIfNeeded()` 把对应的元素滚动到可见区域
    - window.resize 的时候，把 button 变成 relative

36. eslint 和 prettier 冲突怎么办
    <details open>

    其他冲突规则也用类似方法处理，要么修改 eslintrc，要么修改 prettier 配置，但是如果为了少改动老代码，推荐修改 prettier 配置去适应老的 eslint 规则。

37. DOM 如何转虚拟 DOM？ 虚拟 DOM 如何转 DOM
    <details open>

    要做这个题前， 先要知道节点类型

    | 常量                             |  值 |                                           描述                                            |
    | :------------------------------- | --: | :---------------------------------------------------------------------------------------: |
    | Node.ELEMENT_NODE                |   1 |                            一个 元素 节点，例如 <p> 和 <div>。                            |
    | Node.TEXT_NODE                   |   3 |                              Element 或者 Attr 中实际的 文字                              |
    | Node.CDATA_SECTION_NODE          |   4 |                         一个 CDATASection，例如 <!CDATA[[ … ]]>。                         |
    | Node.PROCESSING_INSTRUCTION_NODE |   7 | 一个用于 XML 文档的 ProcessingInstruction (en-US) ，例如 `<?xml-stylesheet ... ?>` 声明。 |
    | Node.COMMENT_NODE                |   8 |                                    一个 Comment 节点。                                    |
    | Node.DOCUMENT_NODE               |   9 |                                   一个 Document 节点。                                    |
    | Node.DOCUMENT_TYPE_NODE          |  10 |        描述文档类型的 DocumentType 节点。例如 <!DOCTYPE html> 就是用于 HTML5 的。         |
    | Node.DOCUMENT_FRAGMENT_NODE      |  11 |                                一个 DocumentFragment 节点                                 |

    用的最多的应该就是 1 和 3 了

    ```js
    const div = document.getElementsByClassName("div_style")[0];
    class VNode {
        constructor(tag, attr, value, type) {
            // 节点名 DIV/P啊这样的
            this.tag = tag && tag.toLowerCase();
            // 属性对象
            this.attr = attr;
            // 值，如果是文本节点就需要有值
            this.value = String(value).trim().length ? value : "";
            // 类型，节点类型
            this.type = type;
            // 孩子们
            this.children = [];
        }
        addChildren(value) {
            this.children.push(value);
        }
    }
    function virtualDom(node) {
        let nodeType = node.nodeType; // 节点类型
        let _vnode = null;
        if (nodeType === 1) {
            // 1为元素节点
            let nodeName = node.nodeName; // 节点名
            let attr = node.attributes; // 节点属性
            let attrObj = {};
            for (let i = 0; i < attr.length; i++) {
                attrObj[attr[i].nodeName] = attr[i].nodeValue; // 遍历节点的所有属性，将属性名与属性值构成键值对
            }
            _vnode = new VNode(nodeName, attrObj, undefined, nodeType); // 构建虚拟DOM对象，传入节点名，节点属性对象和节点类型
            let childNodes = node.childNodes; // 读取当前节点的子节点
            for (let i = 0; i < childNodes.length; i++) {
                _vnode.addChildren(virtualDom(childNodes[i])); // 将当前节点的所有子节点构建成虚拟DOM并存入当前节点的children中保存，构成虚拟DOM树
            }
        } else if (nodeType === 3) {
            // 3为文本节点
            _vnode = new VNode(
                undefined,
                undefined,
                node.nodeValue,
                node.nodeType
            ); // 如果是文本节点，只传入节点的值和节点的类型
        }
        return _vnode;
    }
    // 生成 撒花
    const virtual = virtualDom(div);

    function unVirtual(virtual, farentDom = document.body) {
        if (virtual.type === 1) {
            // 元素节点
            let tempDom = document.createElement(virtual.tag); // 创建元素
            for (const key in virtual.attr) {
                // 遍历插入元素属性
                tempDom.setAttribute(key, virtual.attr[key]);
            }
            farentDom.appendChild(tempDom); // 插入元素
            for (let i = 0; i < virtual.children.length; i++) {
                // 循环递归插入子元素
                unVirtual(virtual.children[i], tempDom);
            }
        } else if (virtual.type === 3) {
            // 文本节点
            var tempText = document.createTextNode(virtual.value); // 创建文本节点
            farentDom.appendChild(tempText); // 插入文本节点
        }
    }
    unVirtual(virtual);
    ```

38. NPM install 运行机制
    <details open>

    [运行机制](https://www.zhihu.com/question/66629910/answer/273992383)

    核心的点就是

    1. 它会先遍历的访问所有的依赖，包括依赖里的依赖，然后，把他们存到根节点下，相当于一个 Map 的概念，这样有重复的模块就不用再添加了

        而重复的模块的定义就是名称一样，和版本兼容一样。（就是范围允许的值）

    2. 如果你 npm install 具体某个包名，同样会去检查 package.json。保证前后的一致性。

39. 装修拖拽的技术方案
    <details open>

    drag 组件是包裹整个装修页面布局的，就是侧边栏和主区域都坐落在内部

    请求接口，从侧边栏展示出已经注册好的模块

    包含模块的名称和模块的 id，图片

    当 mousedown 的时候，通过 `ReactDOM.findDOMNode(this)` 获取当前的鼠标摸下去的模块。

    `var clone = node.cloneNode(true);`
    `var rect = node.getBoundingClientRect();`

    复制当前鼠标摸的模块，并计算当前的偏移位置。`this.start = true`

    监听 mousemove ,当然，得摸到任意一个模块，否则直接 return

    然后改变当前的模块的 x,y 值，让它跟着鼠标一起走 `this.moved = true`

    当触发 mouseUp 的时候，先判断当前 this.move 是不是 true，不是 true 说明不是移动目标进来的

    判断 this.start 是不是 true，不是 true 说明不是拖拽开始。

    把当前添加的那个组件，remove 掉。

    最后执行 onDragEnd;

    同时监听主要展示区域的 mousedown，如果是有组件落在自己的页面下，`this.dragStatus === 'putdown'`。

    在 onDragEnd 的时候呢，判断当前的 dragStatus ，如果不是 putdown，不做任何执行，说明没有把组件拖进来

    如果是 putdown ，说明有组件拖进来了，直接添加组件即可

    在目标区域监听 mousemove 的时候，判断当前拖拽的X, Y 和整个列表上的模块的 `getBoundingClientRect`比较

    ```js
    let rect = tgt.getBoundingClientRect();
    let boundary = rect.top + rect.height / 2;
    this.setState({emptyIndex: elemIndex + (event.pageY < boundary ? 0 : 1)});
    ```
    从而确定它拖拽的位子，然后限时一个 释放鼠标将模块添加到此处 的组件，这个组件是插到对应的index里的。

    当然，这个 mousemove 生效的前提是你有一个draginfo，也就是正在拖拽的模块。

    当你选中了对应要编辑的模块后，右侧会出现一个设置界面，用工厂模式根据配置表，渲染出对应的配置，

    读取之前的配置并填入，最后保存。

    对应模块的 html 和 css 是通过文本存在服务端的。

    然后在前台的时候回读取这部分数据，然后前台是有一个包裹组件，读取到后台吐的模块后，直接根据对应的模块 id，渲染对应的模块数据

    其中所有的模块数据都会去继承一个基础模块，只需要复写里面的打点数据和请求数据，和自己的事件绑定即可。

    而基础模块就是用来渲染对应模块的 html，css 和一些公共可抽出的数据信息。

40. 如果没有promise，如何实现一个串行操作？
    <details open>

    可以自己写一个包裹函数，类迭代器。

    ```js
    var schemeQueue = [];
    function iteratorRegister(fn) {
        var next = function () {
            if (schemeQueue.length === 0) {
                return;
            }
            schemeQueue.shift()(next);
        };

        schemeQueue.push(fn);
    }
    ```

    这样在使用的时候，我的 fn 就是一个一个函数，我只需要进来一次，就把它们添加到我的队列，但是这些 fn 会有 callback ，没有 callback 就当它不是异步，直接执行 next ，如果是异步在 callback 里执行 next，从而达到一个串行的目的。

41. 硬链接和软链接的区别
    <details open>

    1. 连接方式不同
       - 硬： `ln oldfile newfile`
       - 软： `ln -s old new`, 比如将 `core` 软连接到 `node_modules` 下 (run `ln -s ../../mall-core/ ./node_modules`);
    2. 硬链接只能在同一文件系统中的文件之间进行链接，不能对目录进行创建，而软连接是可以对目录进行连接的
    3. 硬的是多个文件指向同一个索引节点，而软的是指向对方目录的一个索引
    4. 如果删除硬链接对应的源文件，则硬链接文件仍然存在，而且保存了原有的内容，而软连接删除了源文件的话，就不行了，相关软连接就变成了死链接。
    5. 为什么？因为删除文件本质上是删除引用节点，软连接如果删除就真没指向了，而硬链接就像复制一样，还会有引用。

    ![haard](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fd6096a17a64d58a73f9e2f2cfc7051~tplv-k3u1fbpfcp-watermark.image)

    ![ruan](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e9d3c5e59454006abde22b822ec22a8~tplv-k3u1fbpfcp-watermark.image)

42. Npm 和 Yarn 和 Pnpm的区别

    <details open>

    [npm和yarn的区别，我们该如何选择](https://juejin.cn/post/6844903582903320589)

    [PNPM 原理](https://juejin.cn/post/6916101419703468045)

    ```js
    "5.0.3", // 安装指定版本
    "~5.0.3", // 安装 5.0.X 最新版本
    "^5.0.3" // 安装 5.X.X 最新版本
    ```

    - 速度
       并行安装：无论 npm 还是 Yarn 在执行包的安装时，都会执行一系列任务。npm 是按照队列执行每个 package，也就是说必须要等到当前 package 安装完成之后，才能继续后面的安装。而 Yarn 是同步执行所有任务，提高了性能
    - 离线模式
       如果之前已经安装过一个软件包，用Yarn再次安装时之间从缓存中获取，就不用像npm那样再从网络下载了。
    - 锁定版本
        yarn 用yarn.lock

        npm 早期用`npm shrinkwrap`生成`npm-shrinkwrap.json`文件， 后来用默认的`package-lock.json`文件和yarn竞争。
    - 输出日志
        yarn 看起来更友好
    - pnpm 利用 硬链接的形式，可以复用nodemodules包, 所以磁盘空间利用非常高效。
    - 在使用 npm/yarn 的时候，由于 node_module 的扁平结构，如果 A 依赖 B， B 依赖 C，那么 A 当中是可以直接使用 C 的，但问题是 A 当中并没有声明 C 这个依赖。因此会出现这种非法访问的情况。但 pnpm 脑洞特别大，自创了一套依赖管理方式，利用软连接的形式，保持的引用的结构，很好地解决了这个问题，保证了安全性

43. 自动化部署 [前端自动化部署](https://juejin.cn/post/6844904009333997582)

    <details open>

    - 使用Dockerfile来构建镜像
    - 通过镜像创建容器
    - 启动容器搭载静态服务器
    - 利用 travis-ci ，在项目的根目录下创建 .travis.yml 文件。里面会写script，和各个生命周期的钩子
    - 提交代码会自动执行。
    - 然后通过公钥和私钥，免密登录，直接把打包好的文件推送到指定服务器上。

    ```yaml
    language: node_js
    node_js:
    - 14

    env:
    - BUILD_NAME=bd

    install:
    - npm install

    branches:
    only:
    - main
    - "/^.*-ci$/"

    notifications:
    email:
        recipients:
        - $EMAIL_SELF
        on_success: always # default: change
        on_failure: always # default: always

    stages:
    - test
    - name: page
        if: commit_message =~ /pub\s+page/
    - name: publish
        if: commit_message =~ /release/

    jobs:
    exclude:
        - if: branch = dev OR commit_message =~ /(no-ci)/
    include:
        - stage: test
        script: npm run test
        - stage: page
        script: npm run $BUILD_NAME && mv dist/ /tmp/demo
        deploy:
            provider: pages
            cleanup: true
            local_dir: /tmp/demo
            token: $GITHUB_TOKEN # Set in travis-ci.org dashboard
            on:
            branch: main

        - stage: publish
        before_install:
            # 解密
            - openssl aes-256-cbc -K $encrypted_db599200e721_key -iv $encrypted_db599200e721_iv -in id_rsa.enc -out ~/.ssh/id_rsa -d
            # 设置正确的权限
            - chmod 600 ~/.ssh/id_rsa
            # 目标IP不进行校验，防止阻碍流程
            - echo -e "Host $HOST_IP\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
        script:
            # 构建脚本
            - npm run $BUILD_NAME
            # 截取分支名，ci-qa 获得 qa，并设置为 DEST_DIR 变量
            - export DEST_DIR=`echo $TRAVIS_BRANCH | cut -d "-" -f 1`
            # 删除远程目标文件夹，并新建目录（这一步需要自己衡量是否需要，一般个人开发建议删除）
            - ssh travis@$HOST_IP -p $HOST_PORT "rm -rf ~/$DEST_DIR && mkdir ~/$DEST_DIR"
            # 将本地文件上传到服务器
            # dist/ 将会在目标文件夹下 存在一个 dist 文件夹
            # dist/. 将直接存储dist目录下的所有文件，而不包括目录名
            - scp  -P $HOST_PORT -r dist/. travis@$HOST_IP:~/$DEST_DIR
            # 上传文件完毕后，可能需要 启动服务 等，自行替换
            - ssh travis@$HOST_IP -p $HOST_PORT "echo 'replace your exec';"
    ```

    - dockerfile + docker-compose来构建docker容器
    - travis-ci + github 来hook repo的变动
    - travis-ci 调用 dockerfile打包 docker image并push到dockerhub
    - travis-ci ssh 登录到目标机器,copy docker-compose并执行来完成部署

    当我们点击提测的时候，会自动创建一个新的test分支，然后当我们在这个开发环境上提交代码的时候，会通过git hook的一个钩子，对jenkins服务器接口发送一个post请求，那边收到这个请求会触发任务，利用docker来执行对应的操作。
