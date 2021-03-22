1. 设计方式

    目前有`hashchange`和`history api`两种方式

    其中，`hashchange`的话，主要靠监听`hashchange`的方式来完成。

    然后`history api`的话，主要靠`history.pushState`, 监听`popstate`来完成。

    `hash`优点

    - `hash`兼容性更好，可以兼容到`IE8`
    - 无需服务端配合处理非单页的`url`地址， history 刷新页面是读取路径的，需要服务端配合

    `hash`缺点

    - 看起来更丑。
    - 会导致锚点功能失效。
    - 相同 `hash`值不会触发动作将记录加入到历史栈中，而 `pushState`则可以。

2. 如何判断`hashchange`里是返回呢？

    在进`hash`监听函数前，先复制 historyLen = history.length;

    然后进了监听后，比对当前的`history.length`和`historyLen`，如果相等的话，说明触发了`hashchange`但是`historylen`没变，那它很可能是返回

    然后再比对一下自己存下来的`historys`的倒数第二个和当前的`url`比对，如果相等，那它可能是返回。为什么说可能，可以看下面第 4 题里面的注释

3. 缓存

    如果是想对路由做缓存处理的话，可以在`Route`组件里，渲染的时候，判断下`path`是不是在`caches`里，如果是并且不是当前的`path`，`display none`即可。

    为了避免太多页面的话，可以只保留 10 个活动页面，超过 10 个就删除最久远的那个。中间有再次被使用的，可以打到队头。（类似微信小程序链表那个问题）

    如果想给暂停的页面一个暂停和回归的生命周期的话。可以让这个页面添加两个监听器，一个是`pause`,一个是`resume`。

    然后在`route`里抛出事件

    ```js
    const goResume = isnone && path == curentpath;
    // 说明要resume了
    emit("resume");
    isnone = false;
    const goNone = !isnone && path !== currentpath && cacheshas;
    emit("pause");
    isnone = true;
    ```

    对于不是React-router而言，如果需要缓存的话，需要自己做activity，一个activity就是一个页面，然后跳转事件统一用自己封装的，然后跳转的时候呢，用链表把前后串起来，触发hashchange，然后在生成新的activity，然后再replace掉，就是隐藏前面的，后面的用新的，而旧的activity会缓存起来，数据什么的都在里面。

    刷新： 调用startApplication => 生成新的application实例(包含路由匹配表，路由跳转方法实例，页面管理器) => 调用application.start => 开始监听页面hashchange => 调用 this.navigate => 在路由匹配管理器里，去匹配路由，如果找到了直接返回，找不到还要去loadProject => 发送对应链接的请求 => 如果是manifest，直接获取，如果是html， 正则获取 => 获取到css和js的路径 => loadJS => 把js 插入页面中 => 自动加载js => 进入子应用的entry.js => 注册子应用的路由 => 这样主应用的`await routeManager.match(url)` 就获取到了值 => 然后`this.currentActivity 是null`，就相当于直接mount

    跳转： 点击按钮 => transitionTo 方法 => 处理url，判断是否是原生跳转还是webview跳转还是正常跳转， 正常跳转调用 => navigation.forward 方法 => 调用Navigation文件下自己的 transitionTo 方法 => 调用 application.navigate 方法 => location.hash = url => 创建或获取新的activity(返回就是获取，在缓存里取) => `activity => preActivity.next = newActivity, new Activity.prev = preActivity` => 调用 activityManager.replaceActivity。

    如果是返回的话，一样的路径，只是会把cache末位的那个删了而已。

4. 原生 hash 实现路由

    ```js
    class Router {
        constructor() {
            // 储存 hash 与 callback 键值对
            this.routes = {};
            // 当前 hash
            this.currentUrl = "";
            // tp
            this.currentSpUrl = "";
            // 记录出现过的 hash
            this.history = [];
            this.ignoreHashChangeCount = 0;

            this.refresh = this.refresh.bind(this);
            this.backOff = this.backOff.bind(this);
            this.onchange = this.onchange.bind(this);
            // 默认不是后退操作
            this.isBack = false;
            window.addEventListener("load", this.refresh, false);
            window.addEventListener("hashchange", this.onchange, false);

            this.historyLen = history.length;
            // 由于history.length 最大是50，所以我们需要额外存一个histoy来进行使用判断。
            // 好像还是有问题的，我没办法解决目前，因为只有靠真正的history.length，才能判读它是真前进后退
            // this.mockHistoryLen = history.length;
        }

        route(path, callback) {
            this.routes[path] = callback || function() {};
        }

        onchange() {
            if (this.ignoreHashChangeCount > 0) {
                this.ignoreHashChangeCount--;
                return;
            }
            this.currentUrl = location.hash.slice(1) || "/";
            this.currentSpUrl = this.currentUrl + "-" + Date.now();
            console.log(
                "%c======>>>>>>",
                "color: #f20",
                this.historyLen,
                history.length,
                this.mockHistoryLen
            );
            console.log("%c======>>>>>>", "color: #f20", this.history);
            // 为什么说只有length，因为触发返回拦截的时候再forward回来的时候，并没有新增historylen，所以那次也会触发。
            // 但是，如果加上了后面的那个条件后，在本路由组里没问题，但是如果刷新了后，
            // this.history会变空，那就不行了，返回就没法正确的表示了。
            // 所以，我们需要把条件变成或，然后，加上一个flag，就是容错flag，当触发了返回拦截的时候，忽略那次的hashchange即可
            this.isBack =
                this.historyLen == this.mockHistoryLen ||
                this.currentSpUrl == this.history[this.history.length - 2];
            // 这个事件还真只能新建一次
            this.beforeBack = new Event("beforeback", {
                bubbles: true,
                cancelable: true
            });
            if (this.isBack) {
                window.dispatchEvent(this.beforeBack);
                console.log(
                    "%c======>>>>>+++>",
                    "color: #f20",
                    this.beforeBack
                );
                this.history.pop();
                if (this.beforeBack.defaultPrevented) {
                    console.log("拒绝返回");
                    this.ignoreHashChangeCount++;
                    history.forward();
                    return;
                }
            } else {
                this.historyLen = this.mockHistoryLen;
                this.mockHistoryLen++;
                this.history.push(this.currentSpUrl);
                this.routes[this.currentUrl]();
            }
        }

        refresh() {
            this.currentUrl = location.hash.slice(1) || "/";
            this.currentSpUrl = this.currentUrl + "-" + Date.now();
            this.history.push(this.currentSpUrl);
            this.routes[this.currentUrl]();
        }

        // 后退功能
        backOff() {
            history.back();
        }
    }

    window.router = new Router();
    const button = document.querySelector("button");

    function changeContent(value) {
        document.getElementsByTagName("h1")[0].innerHTML = value;
    }

    function onback(e) {
        e && e.preventDefault();
        alert("别想走");
    }

    router.route("/", function() {
        console.log("");
        changeContent("");
    });
    router.route("/a", function() {
        console.log("a");
        changeContent("a");
        window.removeEventListener("beforeback", onback);
    });
    router.route("/b", function() {
        console.log("b");
        changeContent("b");
        window.removeEventListener("beforeback", onback);
    });
    router.route("/c", function() {
        console.log("c");
        changeContent("c");
        window.removeEventListener("beforeback", onback);
    });
    router.route("/d", function() {
        changeContent("d");
        window.addEventListener("beforeback", onback);
    });
    button.addEventListener("click", router.backOff, false);
    ```

5. react hash 实现参考

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
            currentPath: utils.extractHashPath(window.location.href)
        };

        onHashChange = e => {
            const currentPath = utils.extractHashPath(e.newURL);
            console.log("onHashChange:", currentPath);
            this.setState({ currentPath });
        };

        componentDidMount() {
            window.addEventListener("hashchange", this.onHashChange);
        }

        componentWillUnmount() {
            window.removeEventListener("hashchange", this.onHashChange);
        }

        render() {
            return (
                <RouteContext.Provider
                    value={{ currentPath: this.state.currentPath }}
                >
                    {this.props.children}
                </RouteContext.Provider>
            );
        }
    }
    export default ({ path, render }) => (
        <RouteContext.Consumer>
            {({ currentPath }) => currentPath === path && render()}
        </RouteContext.Consumer>
    );

    export default ({ to, ...props }) => <a {...props} href={"#" + to} />;
    ```

6. 原生 js history 参考

    ```js
    class Routers {
        constructor() {
            this.routes = {};
            // 在初始化时监听popstate事件
            this._bindPopState();
        }
        // 初始化路由
        init(path) {
            history.replaceState({ path: path }, null, path);
            this.routes[path] && this.routes[path]();
        }
        // 将路径和对应回调函数加入hashMap储存
        route(path, callback) {
            this.routes[path] = callback || function() {};
        }

        // 触发路由对应回调
        go(path) {
            history.pushState({ path: path }, null, path);
            this.routes[path] && this.routes[path]();
        }
        // 后退
        backOff() {
            history.back();
        }
        // 监听popstate事件
        _bindPopState() {
            window.addEventListener("popstate", e => {
                const path = e.state && e.state.path;
                this.routes[path] && this.routes[path]();
            });
        }
    }
    ```

7. history react 参考

    ```js
    export default class HistoryRouter extends React.Component {
        state = {
            currentPath: utils.extractUrlPath(window.location.href)
        };

        onPopState = e => {
            const currentPath = utils.extractUrlPath(window.location.href);
            console.log("onPopState:", currentPath);
            this.setState({ currentPath });
        };

        componentDidMount() {
            window.addEventListener("popstate", this.onPopState);
        }

        componentWillUnmount() {
            window.removeEventListener("popstate", this.onPopState);
        }

        render() {
            return (
                <RouteContext.Provider
                    value={{
                        currentPath: this.state.currentPath,
                        onPopState: this.onPopState
                    }}
                >
                    {this.props.children}
                </RouteContext.Provider>
            );
        }
    }
    export default ({ path, render }) => (
        <RouteContext.Consumer>
            {({ currentPath }) => currentPath === path && render()}
        </RouteContext.Consumer>
    );
    export default ({ to, ...props }) => (
        <RouteContext.Consumer>
            {({ onPopState }) => (
                <a
                    href=""
                    {...props}
                    onClick={e => {
                        e.preventDefault();
                        window.history.pushState(null, "", to);
                        onPopState();
                    }}
                />
            )}
        </RouteContext.Consumer>
    );
    ```

8. 动态路由，怎么识别

    首先，我们的路由是 `"/item/:id": Spu` 这样的结构，后面就是真正的 container。

    然后，上来就会注册路由，每个路由对象拥有自己的 regex, container,name 这些属性。

    动态匹配路由,主要思路就是把`/`作为分割符号，把路径分割成数组

    然后`replace`每个位置的值，遇到`:xxx`的，替换成`([^\/]+)` 代表只要不是/就都行。

    然后如果想自定义 reg，比如商详 id 是数字的，可以在:前自己写`\\d+`,这样的话

    在 replace 的时候，函数的第一个参数是匹配的 str，按我们的写法就是全体

    第二个参数就是匹配到的第一个子式，就是我们传进去的正则

    第三个参数就是匹配到的第二个子式, 就是我们传的那个 id

    如果我们不写正则的话，:xxx 因为只有第二个子式，没有第一个子式匹配到，就会没有，所以会取默认的([^\/]+)

    ```js
    // 传入对应的str， match, regex, id, end 就是下面replace函数的参数值
    // str = ":id", match = :id, regex = ""; id = id, end = 0
    // str = "\d+:id", match = '\d+:id', regex = "\d+", id = id, end = 0;

    const paths = name.split("/").map(item => {
        return !item
            ? ""
            : item.replace(/^(.*):([\w_]+)/, (match, regex, id, end) => {
                  // (this.map || (this.map = [])).push(id); 这个和路由id无关，但是因为作为map，最后会到params里。
                  return "(" + (regex || "[^\\/]+") + ")";
              });
    });
    this.regex = new RegExp("^" + paths.join("\\/") + "$", "i");
    ```

    我们举个例子，现在有个路由，叫 `'/item/:id'`， 那么 split('/') 后，得到的是`['', 'item', ':id']`

    那么空我们不考虑，item replace 不着，所以前面两个替换完的，就是空，和`item`

    那么`:id`，命中了`/^(.*):([\w_]+)/`， 替换的结果就是([^\\/]+) 就是只要不是 / 都可以。

    OK， 我们现在得到的 paths 是 `["", "item", "([^\/]+)"]`;

    最后通过`new RegExp`，完成正则表达式，最后只要当前的地址，`'/item/30681122'.match(regex)` 肯定是有返回值的，就代表通过匹配，可以转发对应的`container`

9. 如何给页面加resume, pause事件。

   首先，只有缓存的情况下，才有必要。

   当跳转到下一张页面的时候，前一张页面display none。然后就可以触发 pause 事件。
   
   当页面 active 的时候，判断这个是返回还是前进，返回的话，触发resume

   那么，接受他们的话，可以用装饰器，封装到类上，这样只要加上这个装饰器，就有生命周期了