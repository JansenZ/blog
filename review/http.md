
### HTTP/浏览器

1. 常用的HTTP状态码有哪些？

    * 2xx请求成功
        * 200 OK 看的最多的
        * 204 请求成功，但是响应报文里不含实体的主题部分
        * 206 部分请求，看视频的时候会有这样的请求
    * 3xx重定向
        * 301 永久重定向
        * 302 临时重定向 ,301和302的区别就是，一旦设置了301,除非浏览器清除缓存，否则这个浏览器永远都访问的是重定向的那个地址了，而302的话是每次都会重新定向过去。
        * 304 缓存（单独说）
    * 4xx客户端错误
        * 400 请求报文语法错误
        * 401 没有授权
        * 403 forbidden 被拒绝了
        * 404 找不到资源
    * 5xx 服务器错误
        * 500 服务器内部错误
        * 502 网关错误
        * 503 服务器服务不行了
        * 504 超时
2. HTTP/1.1协议中有哪些方法

    HTTP方法的幂等性是指一次和多次请求某一个资源应该具有同样的副作用）（get它本身不会对资源本身产生影响，因此满足幂等性。

    GET(幂等)、POST（非幂等）、HEAD（幂等）、PUT（幂等）、DELETE（幂等）、OPTIONS
3. POST与GET的区别

    * GET请求会被浏览器主动cache，而POST不会.
    * GET返回是无害的，POST返回的时候会再请求一次。
    * GET请求只能进行url编码，而POST支持多种编码方式。
    * GET请求参数会被完整保留在浏览器历史记录里，而POST中的参数不会被保留。
    * GET请求在URL中传送的参数是有长度限制的，而POST没有。
    * 对参数的数据类型，GET只接受ASCII字符，而POST没有限制。
    * GET比POST更不安全，因为参数直接暴露在URL上，所以不能用来传递敏感信息。
    * GET参数通过URL传递，POST放在Request body中。
    * 对于GET方式的请求，浏览器会把http header和data一并发送出去，服务器响应200（返回数据），而对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok（返回数据）。
4. HTTP请求头和响应头都有哪些内容

    * content-type: 传输的媒体类型，是图片还是JSON数据还是text/html之类的东西
    * ETag: 配合缓存使用的资源标识
    * cache-control: 资源缓存有效期
    * Content-Encoding: 请求体/响应体的编码格式
    * content-length: 请求体/响应体的长度，单位字节
    * cookie: 缓存信息
    * user-agent: 浏览器信息
    * origin: 返回协议，主机名，端口号
    * referer: 来自的地址
    * expires: 过期时间
    * status: 相应状态码
    * date: 服务器事件
    * last-modified: 该资源最后修改的时间
    * set-cookie: 设置cookie
5. HTTP缓存机制流程

    分为强制缓存和协商缓存

    * 走强制缓存的情况下
        * cache-control，expires这两个属性 前者优先于后者
        * cache-control设置 max-age的时候，低于这个过期时间，状态码会返回200。像js,图片这样的，会进入from membory cache, css这样的会进from disk cache
        * cache-control设置为 private的时候，只有本地缓存，走强缓存。
        * cache-control设置为no-cache的时候，本地还是会先缓存下来，只是没有强制缓存，会走协商缓存
        * cache-control设置为no-store的时候，啥缓存都没有，所有数据从服务端再拉取。
    * 走协商缓存的情况下（post不支持）
        * 看last-modified和etag，服务器响应请求的时候，会把last-modified或etag的值给客户端。
        * 客户端下次请求的时候，会带上If-Modified-Since / If-None-Match，然后服务端进行比对，如果没有变动的话，直接返回304，客户端自己用缓存数据。
        * 其中，etag和last-modified都支持的话，服务器会优先选etag。
        * last-modified的缺点是

             编辑了资源文件，但是文件内容并没有更改，这样也会造成缓存失效。

             Last-Modified 能够感知的单位时间是秒，如果文件在 1 秒内改变了多次，那么这时候的 Last-Modified 并没有体现出修改了。
        * 而etag是根据您文件内容生成的hash值，所以不会有上述问题。
        * 在性能上，Last-Modified优于ETag，也很简单理解，Last-Modified仅仅只是记录一个时间点，而 Etag需要根据文件的具体内容生成哈希值。
6. HTTPS
    * https比http多了个ssl层，会对数据进行加密，对身份进行认证会更安全
    * https默认端口号是443，http是80
    * https是需要有证书的

    对称加密，是指加密和解密用同一个密钥
    * 浏览器发送一个加密方法列表list和自己生成的一个随机数给服务器
    * 服务器发送一个加密方法和自己生成的一个随机数给浏览器
    * 现在利用这三个双方生成密钥。
    * 这个很容易被抓取，所以不太安全。

    非对称加密，在这种加密方式中，服务器手里有两把钥匙，一把是公钥，另一把是私钥，只有服务器自己知道。
    * 浏览器发送一个加密方法列表list和自己生成的一个随机数给服务器
    * 服务器发送一个加密方法，自己生成随机数，和公钥给浏览器
    * 浏览器拿到公钥，服务器用私钥。这样浏览器发的数据，外面的人就无法抓取了。但是。服务器发的数据，外面的还是可以抓取的。
    
    结合
    * 浏览器发送一个加密方法列表list和自己生成的一个随机数给服务器
    * 服务器发送一个加密方法，自己生成随机数，和公钥给浏览器
    * 浏览器再生成一个随机数，并且用服务器发来的公钥加密，然后到服务器。
    * 然后服务器用私钥解密它。这个时候用这四个数据生成密钥，对称加密交互数据即可。
    * 这样第三方即使拿到浏览器生成的第二个随机数没有私钥也解不开。

    尽管通过两者加密方式的结合，能够很好地实现加密传输，但实际上还是存在一些问题。

    黑客如果采用 DNS 劫持，将目标地址替换成黑客服务器的地址，然后黑客自己造一份公钥和私钥，照样能进行数据传输。

    而对于浏览器用户而言，他是不知道自己正在访问一个危险的服务器的。

    事实上HTTPS在上述结合对称和非对称加密的基础上，又添加了数字证书认证的步骤。其目的就是让服务器证明自己的身份。

    这个时候，即使中间人想修改证书里的公钥也没用，因为这份证书还有一个用CA机构私钥签发的数字签名，这个签名客户端在

    拿到手后会用公钥解签，然后拿解开的sig2和自己用公开的hash加密证书送来的明文信息，只要被篡改过了，就不可能一样。

    总结就是https利用证书和非对称加密和对称加密的方式把数据加密而不被泄漏，然后为了防止中间有人更改公钥，要用CA证书去认证一下。
31. 什么是DNS劫持

    运营商会把你访问的地址给跳到它要跳的地址。因为你访问域名解析的时候，通常这个服务是运营商提供的。给你解析一个他想跳的广告地址。
7. HTTP2对比HTTP1.1

    * 二进制分帧，HTTP1.x是文本协议，用二进制协议解析效率会更高
    * 多路复用 这样的话基本就不会阻塞。
    * http1.1的话，浏览器对同一域名下的下载并发不超过6个。超过6个的话，剩余的将会在队列中等待，这就是为什么我们要将资源收敛到不同的域名下。
    * 头部压缩  增强性能
    * 服务器推送
8. 跨域的解决方案

    跨域是由于浏览器的同源策略造成的，同源就是指域名、协议、端口均相同。主要是为了安全。

    跨域请求能发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了

    常见的解决方案有
    1. jsonp，hack行为，利用script src完成跨域，这样的话就只有get请求了
    2. postMessage，解决客户端两个窗口之间的通信，不能和服务端数据交互  
        A窗口使用window.postMessage(data,B)；
        B窗口里addeventlistenter('message', function(event) {
            event.data就是那个数据。
        });
    3. cors,Cross-origin resource sharing，跨域资源共享，分为简单请求和非简单请求
    简单请求的话
        （1) 请求方法是以下三种方法之一：
            HEAD,
            GET,
            POST,
        （2）HTTP的头信息不超出以下几种字段：
            Accept,
            Accept-Language,
            Content-Language,
            Last-Event-ID,
            Content-Type：
                application/x-www-form-urlencoded、 multipart/form-data、text/plain,

        浏览器自动添加orgin，然后服务器返回的响应里会多出几个access-control-allow-xx 的东西，代表在白名单里，允许cors
    非简单请求

        不满足上面的特征，就是非简单请求，比如truck后台的contenttype是application/json
        浏览器会自动发一个options的请求，确定OK后，才会继续发请求
    4. iframe。B页面是A页面的一个iframe，A页面把数据变更填到B页面的url上。然后B页面监听url变化。

9. script async和defer的区别（对csr来说已经失去了意义，毕竟HTML本来就只有root标签了）

    async和defer都是立马下载js，和html是异步的

    但是async下载完了会立马执行，如果这个时候html还没渲染完，还是会阻塞。defer的话需要等待domcontentLoaded结束后再执行。
10. DOCTYPE是啥，head里面的东西代表啥

    DTD,就是DOCTYPE用来声明文档的解析类型，浏览器判断应该用哪种协议来解析，比如html5和html4

    head里可以放title（title 是必须的），元数据meta

    meta里可以写keywords，description，用于SEO

    meta里可以写viewport，针对移动端，可以在content里定义最小最大缩放比例，宽高。

11. cookie, sessionstoreage， localstorage区别
    * cookie是和服务端交互时使用的，会带在请求头上，随着请求的增多，会造成性能浪费
    * cookie的大小只有4KB
    * cookie可能会被篡改
    * cookie 里不设置expires的话，就是个会话型cookie
    * cookie 里的属性httponly，设置的话,js就无法操作cookie
    * cookie 里的samesite
        * 设置为strict，就是只允许当前url访问当前网址才会带cookie。如果你是从taobao.com点击链接跳转到baidu.com的话，是无法获取cookie的。
        * 设置为lax，就是chrome 80以后默认的，就是只允许导航到目标网址的 Get 请求，post,ajax,image都不会携带。
        * 设置为none，就没有限制了
    * cookie 里的domain和path。就是确定这个cookie在哪个域下绑定。也就是说cookie是同站，和跨域的同源是不一样的。
    * cookie 里的secure属性，设置了就必须是https
    * 跨域请求如果想要带上cookie的话，请求头里的withCredentials还要设置为true。

    * localstorage大小有5M，持久化存储
    * sessionstorage在窗口关闭后就没有了
12. 浏览器渲染全流程
    网络：输入地址-构建请求-先查找强缓存-命中缓存的话用缓存。（HTTP缓存机制）

    没有的话，进入DNS解析，检查是否有dns缓存，有的话直接用，没有的话还要去查找到对应网址的IP地址，在去查找Ip的过程中如果有CDN缓存的话，会返回CDN缓存服务器的地址。然后建立TCP连接，通过三次握手的方式建立连接。

    1. 第一次握手：客户端给服务器发送一个 SYN 报文。
    2. 第二次握手：服务器收到 SYN 报文之后，会应答一个 SYN+ACK 报文。
    3. 第三次握手：客户端收到 SYN+ACK 报文之后，会回应一个 ACK 报文。
    4. 服务器收到 ACK 报文之后，三次握手建立完成。

    然后就可以通信了，客户端发送HTTP请求，服务器得到请求后开始下发信息。

    解析：浏览器在得到了服务端回的HTML信息后，通过编译原理那套构建DOM树，同时，下载其中的CSS文件，CSS文件下载完后，处理CSS生成CSSOM树。

    其中，如果解析过程中遇到js文件的话，会阻塞而去下载js的

    然后把DOM树和CSSOM树合成一个渲染树，然后通过layout去把标签的位置和内容渲染上去。

    然后根据渲染树来把各个节点绘制到屏幕上。

    绘制结束后，四次挥手后关闭连接。
25. 为什么三次握手不能两次搞定？

    因为第二次握手的时候，是服务端回SYN+ACK报文，在客户端收到这条消息后，确定了服务端的发送和接收能力是没有问题的。

    但是，并不能确认客户端接收有没有问题。也就是说，服务端并不知道客户端收到了这条消息了没有，所以必须要有第三次握手，这个特点也是SYN攻击的一种方式。

26. 什么是半连接队列（三次握手）

    服务端在二次握手后，就进入半连接队列，会占用部分资源。
27. 三次握手可以带数据吗？

    第三次可以，前两次不行，第三次是由客户端发起，其实也就证明了连接没问题，所以可以带数据，前两次的话都不能证明连接有没有问题，所以不能带数据。
28. 客户端和服务端连接通过后，中间要是断了怎么办？

    服务端回等到超时，然后发现没有客户端消息，会发送探测报文给客户端，如果多次发送都没有回应，就说明客户端不在了，就可以关闭连接。
28. 说说四次挥手

    四次挥手客户端和服务端都可以发起。

    假设客户端发起。

    第一次，客户端自己的数据发完了，发送关闭请求（FIN连接释放报文），变成FIN_WAIT1状态，并关闭TCP连接，也就是不能再发数据了，并等待服务端确认。

    第二次，服务端收到消息后，由于不能保证自己数据已经处理完了，所以会先回一个ACK报文，表示我知道了，然后进入CLOSE_WAIT状态。这个时候客户端收到了会进去FIN_WAIT2状态。

    第三次，服务端搞定所有了，准备断开连接了，发送FIN（连接释放报文）并改状态为LAST_ACK，这时候服务端也不能发送消息了。

    第四次，客户端收到消息后，进入TIME_WAIT状态，并发送一个ACK报文，告诉服务端我关闭了。服务端收到后关闭自己。TIME_WAIT事件到后关闭连接。

29. 四次挥手为什么要有TIME_WAIT 等待2MSL（4分钟）

    防止第四次服务端没收到，1MSL就是单片段最大存活时间，如果服务端过了1msl没收到，会发送一个fin给客户端，客户端收到这个说明服务端没有收到上次的消息，于是重发并充值time_wait。如果等2MSL服务端没反应，说明没问题，关闭连接。
13. 原生ajax,fetch、axios
    ```
    let xhr = new XMLHttpRequest();
    xhr.open('get', url);第三个参数是是否是异步，默认是。
    xhr.onreadystatechange = function() {
        if(xhr.status == 200 && xhr.readystate == 4){ // 4代表done，该请求
            //...
        }
    }
    xhr.send();
    xhr.abort();是可以暂停异步请求的
    ```

    fetch，基于promise设计的，所以对于async,await友好。

    两次then，第一次返回一个response对象，要转json。

    然后返回数据，正常情况下需要封装一下body

    body内容的话要根据content-type来的，默认的话就是formdata的那种，是拼接的。如果是application/json的话就直接jsonstringify
    ```
    function hanldeParams(params) {
        return Object.keys(params).reduce(function (result, key) {
            var val = params[key];
            if (val !== undefined && val !== null) {
                result.push(key + "=" + encodeURIComponent(isArray(val) || isPlainObject(val)
                    ? JSON.stringify(val)
                    : val));
            }
            return result;
        }, []).join('&');
    }
    ```

    fetch不能中止请求。

    axios就是在原生的基础上用promise封装的

14. load 和 DomContentLoaded区别

    * DomContentLoaded正常是html加载完就触发了
    * css加载不会阻塞DOM树的解析,因为本来就是并行的
    * css加载会阻塞DOM树的渲染，因为最终两者要合成一个渲染树
    * css加载会阻塞后面js语句的执行、为了防止渲染出现不可预期的结果,浏览器设置 GUI 渲染线程与 JavaScript 引擎为互斥的关系。
    * 如果页面中同时存在css和js，并且存在js在css后面，则DOMContentLoaded事件会在css加载完后才执行。
    * 其他情况下，DOMContentLoaded都不会等待css加载，并且DOMContentLoaded事件也不会等待图片、视频等其他资源加载。
    * 而load的话就是所有资源都加载完才算完
15. 浏览器的GC机制,内存泄漏的几种方式

    内存泄漏多了会导致内存溢出从而服务器变慢到崩溃，内存泄漏通常就是GC不行之类所导致的，

    常见的内存泄漏有
    1. conole.log，通过该方法写出来的，都不会被回收
    2. 闭包，闭包利用了作用域链，即使出了调用栈也能引用到
    3. DOM泄漏，就是某些DOM在执行删除更新操作后，没有释放其引用。因为有可能其他地方也用到了，这属于强引用。
    4. 计时器忘记清了也是
    * 引用计数
    循环引用会导致引用计数不对
    * 标记清除，就是生命的时候标记它，当找不到的时候就清楚它。
    不能完全避免，可以优化自己的代码，比如使用弱引用的，weakMap这样的东西。

16. service worker/ PWA（渐进式应用）

    可以拦截HTTP请求进行修改，可以做离线存储，可以做缓存。

    由navigator.serviceWorker.register（‘sw.js’）注册一个，然后再对应的sw.js里写各种拦截，缓存的代码。

    sw.js，配合cacahestorageApi(window.caches)，配合fetch，这就是一个完整的pwa

    Service Worker 是一种独立于主线程之外的 Javascript 线程。它脱离于浏览器窗体，因此无法直接访问 DOM。这样独立的个性使得 Service Worker 的“个人行为”无法干扰页面的性能，这个“幕后工作者”可以帮我们实现离线缓存、消息推送和网络代理等功能。我们借助 Service worker 实现的离线缓存就称为 Service Worker Cache。

    Service Worker 的生命周期包括 install、active、working 三个阶段。一旦 Service Worker 被 install，它将始终存在，只会在 active 与 working 之间切换，除非我们主动终止它。这是它可以用来实现离线存储的重要先决条件。
    ```
    // Service Worker会监听 install事件，我们在其对应的回调里可以实现初始化的逻辑  
    self.addEventListener('install', event => {
        event.waitUntil(
            // 考虑到缓存也需要更新，open内传入的参数为缓存的版本号
            caches.open('test-v1').then(cache => {
                return cache.addAll([
                    // 此处传入指定的需缓存的文件名
                    '/test.html',
                    '/test.css',
                    '/test.js'
                ])
            })
        )
    })
    // Service Worker会监听所有的网络请求，网络请求的产生触发的是fetch事件，
    // 我们可以在其对应的监听函数中实现对请求的拦截
    // 进而判断是否有对应到该请求的缓存，实现从Service Worker中取到缓存的目的
    self.addEventListener('fetch', event => {
        event.respondWith(
            // 尝试匹配该请求对应的缓存值
            caches.match(event.request).then(res => {
                // 如果匹配到了，调用Server Worker缓存
                if (res) {
                    return res;
                }
            // 如果没匹配到，向服务端发起这个资源请求
            return fetch(event.request).then(response => {
                    if (!response || response.status !== 200) {
                        return response;
                    }
                    // 请求成功的话，将请求缓存起来。
                    caches.open('test-v1').then(function(cache) {
                        cache.put(event.request, response);
                    });
                    return response.clone();
                });
            })
        );
    });
    ```
17. XSS、CSRF（如何攻击，如何防御）

    XSS攻击，跨站脚本攻击，cross site scripting

    分为几类，一个是存储型攻击，比如在评论区发执行脚本，那么这段脚本就被存储起来了，其他用户打开就会执行，如果他写了个盗取你的cookie的，你就没了

    一个是反射型攻击，比如在url上的某参数上写脚本，然后如果前端没处理直接显示的话，就会执行该脚本
    
    防范的话
    1. 就是不能相信任何用户的输入，一定要对用户的输入进行转码或者过滤
    2. 限制其他域的资源加载和数据提交
    3. 利用HttpOnly来防止js读取cookie。
    CSRF的话，跨站请求伪造，就是利用用户自己的cookie信息，让用户自己去点击，来去请求一些关键数据请求。其实这个就类似于现在的分享点赞之类的，只不过一个是光明正大的，一个是伪造的。

    比如用户自己登录了淘宝网站，有了淘宝g.alian.com的cookie。然后呢，然后黑客自己也有一个网站B，你在访问B的时候，它里面可能会有隐藏标签，实际就是指向淘宝的地址，比如转账啊之类的。然后你就中招了。

    防范的话
    1. 关键请求需要验证码，增强交互，
    2. 利用请求头的referer，验证是否是自己白名单里的地址过来的。
    3. 添加token验证. 
    4. cookie里的samesite属性，设置为strict或者是lax都可以避免。
18. location下有哪些常用属性

    * hash返回哈希部分
    * host返回主机名和端口
    * href返回完整的url
    * pathname返回url路径名
    * port返回端口
    * protocol返回协议
    * search返回？后面的
    * origin返回URL的协议，主机名和端口号
    * 正常的拼接就是orgion + pathname
19. navigator对象下有哪些常用属性

    包含浏览器和设备的一些相关信息,

    常见的有userAgent， online（判断是否有网） cookieEnabled是否允许cookie，platform浏览器所在的系统平台
20. SYN攻击是什么？

    SYN攻击是典型的DOS攻击，就是利用大量不存在的IP地址的和服务端建立TCP连接，第三次握手频频得不到，导致服务端的半连接队列爆了至崩溃，解决方案就是缩短超时时间。或者是增加半连接上限。
21. CDN的作用和原理

    CDN作用就是有缓存。
    1. 首先访问本地的 DNS（用于解析域名为ip地址） ，如果没有命中，继续递归或者迭代查找，直到命中拿到对应的 IP 地址。（HTTPS默认是没有DNS缓存的）
    2. 拿到对应的 IP 地址之后服务器端发送请求到目的地址。注意这里返回的不直接是 cdn 服务器的 IP 地址，而是全局负载均衡系统的 IP 地址
    4. 全局负载均衡系统会根据客户端的 IP地址和请求的 url 和相应的区域负载均衡系统通信
    5. 区域负载均衡系统拿着这两个东西获取距离客户端最近且有相应资源的cdn 缓存服务器的地址，返回给全局负载均衡系统
    6. 全局负载均衡系统返回确定的 cdn 缓存服务器的地址给客户端。
    7. 客户端请求缓存服务器上的文件
22. 回源是什么意思？

    当 cdn 缓存服务器中没有符合客户端要求的资源的时候，缓存服务器会请求上一级缓存服务器，以此类推，直到获取到。

    最后如果还是没有，就会回到我们自己的服务器去获取资源。这个整体过程就是回源

    那都有哪些时候会回源呢？没有资源，资源过期，访问的资源是不缓存资源等都会导致回源。
23. 理解WebSocket协议的底层原理、与HTTP的区别

    HTTP通信只能由客户端发起。HTTP2支持服务端推送。

    SOCKET可以由服务端通知，是长链接。

    （1）建立在 TCP 协议之上，服务器端的实现比较容易。
    （2）与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此不容易屏蔽，能通过各种 HTTP 代理服务器。
    （3）数据格式比较轻量，性能开销小，通信高效。
    （4）可以发送文本，也可以发送二进制数据。
    （5）没有同源限制，客户端可以与任意服务器通信。
    （6）协议标识符是ws（如果加密，则为wss），服务器网址就是 URL。
24. DOM,BOM区别

    js由三种组成
    1. ECMAScript(核心) 　　描述了JS的语法和基本对象
    2. DOM 是文档对象模型，处理网页内容的方法和接口。是W3C 的标准； [所有浏览器公共遵守的标准]
    3. BOM 是浏览器对象模型，提供与浏览器交互的方法和接口。各个浏览器厂商根据 DOM在各自浏览器上的实现;[表现为不同浏览器定义有差别,实现方式不同]，window就是BOM的，不同的宿主环境可能会有不同的BOM API

30. cookie session token
    * session,前端登录完了后，后端会生成一个sessionid并set到cookie里，session是存储在tomcat容器中，所以如果后端及其有多台的话，多机器之间是无法共享session的，可以用spring提供的分布式session解决方案，把session存到redis中去。
    * sessionid的使用就是前端会自动带session在cookie上，服务端会匹配id，实现一一对应。
    * token，token是服务端将用户信息经过base64url编码后，返回给客户端，前端会存下这个token，每次用户发生需要登录太的请求的时候，前端会带上token参数，服务端在拿到这个token信息后解密就知道用户是谁了，这个方法叫做JWT（json web token），token由于是前端带的，所以适用于分布式微服务。
