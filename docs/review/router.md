1. 设计方式

目前有`hashchange`和`history api`两种方式

其中，`hashchange`的话，主要靠监听`hashchange`的方式来完成。

然后`history api`的话，主要靠`history.pushState`, 监听`popstate`来完成。

`hash`优点

- `hash`兼容性更好，可以兼容到`IE8`
- 无需服务端配合处理非单页的`url`地址
  `hash`缺点
- 看起来更丑。
- 会导致锚点功能失效。
- 相同 `hash`值不会触发动作将记录加入到历史栈中，而 `pushState`则可以。

2. 如何判断`hashchange`里是返回呢？

在进`hash`监听函数前，先复制 historyLen = history.length;

然后进了监听后，比对当前的`history.length`和`historyLen`，如果相等的话，说明触发了`hashchange`但是`historylen`没变，那它很可能是返回

然后再比对一下自己存下来的`historys`的倒数第二个和当前的`url`比对，如果相等，那它就是返回。

3. 缓存

如果是想对路由做缓存处理的话，可以在`Route`组件里，渲染的时候，判断下`path`是不是在`caches`里，如果是并且不是当前的`path`，`display none`即可。

为了避免太多页面的话，可以只保留 10 个活动页面，超过 10 个就删除最久远的那个。中间有再次被使用的，可以打到队头。（类似微信小程序链表那个问题）

如果想给暂停的页面一个暂停和回归的生命周期的话。可以让这个页面添加两个监听器，一个是`pause`,一个是`resume`。

然后在`route`里抛出事件

```js
const goResume = isnone && path == curentpath
说明要resume了
emit('resume');
isnone = false;
const goNone = !isnone && path !== currentpath && cacheshas
emit('pause')
isnone = true;
```

4. 原生 hash 实现路由

```js
class Router {
    constructor() {
      // 储存 hash 与 callback 键值对
      this.routes = {};
      // 当前 hash
      this.currentUrl = '';
      // 记录出现过的 hash
      this.history = [];
      // 作为指针,默认指向 this.history 的末尾,根据后退前进指向 history 中不同的 hash
      this.currentIndex = this.history.length - 1;
      this.backIndex = this.history.length - 1
      this.refresh = this.refresh.bind(this);
      this.backOff = this.backOff.bind(this);
      // 默认不是后退操作
      this.isBack = false;
      window.addEventListener('load', this.refresh, false);
      window.addEventListener('hashchange', this.refresh, false);
    }

    route(path, callback) {
      this.routes[path] = callback || function() {};
    }

    refresh() {
      this.currentUrl = location.hash.slice(1) || '/';
      this.history.push(this.currentUrl);
      this.currentIndex++;
      if (!this.isBack) {
        this.backIndex = this.currentIndex
      }
      this.routes[this.currentUrl]();
      console.log('指针:', this.currentIndex, 'history:', this.history);
      this.isBack = false;
    }
    // 后退功能
    backOff() {
      // 后退操作设置为true
      this.isBack = true;
      this.backIndex <= 0 ?
        (this.backIndex = 0) :
        (this.backIndex = this.backIndex - 1);
      location.hash = `#${this.history[this.backIndex]}`;
    }
  }
```

5. react hash 实现参考

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
        <RouteContext.Provider value={{currentPath: this.state.currentPath}}>
          {this.props.children}
        </RouteContext.Provider>
      );
    }
  }
export default ({ path, render }) => (
    <RouteContext.Consumer>
      {({currentPath}) => currentPath === path && render()}
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
      history.replaceState({path: path}, null, path);
      this.routes[path] && this.routes[path]();
    }
    // 将路径和对应回调函数加入hashMap储存
    route(path, callback) {
      this.routes[path] = callback || function() {};
    }

    // 触发路由对应回调
    go(path) {
      history.pushState({path: path}, null, path);
      this.routes[path] && this.routes[path]();
    }
    // 后退
    backOff(){
      history.back()
    }
    // 监听popstate事件
    _bindPopState() {
      window.addEventListener('popstate', e => {
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
        <RouteContext.Provider value={{currentPath: this.state.currentPath, onPopState: this.onPopState}}>
          {this.props.children}
        </RouteContext.Provider>
      );
    }
  }
  export default ({ path, render }) => (
    <RouteContext.Consumer>
      {({currentPath}) => currentPath === path && render()}
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

动态匹配路由,主要思路就是把/作为分割符号

然后`replace`每个位置的值，遇到:xxx 的，替换成([^\/]+)代表只要不是/就都行。

然后如果想自定义 reg，比如商详 id 是数字的，可以在:前自己写\\d+,这样的话

在 replace 的时候，函数的第一个参数是匹配的 str，按我们的写法就是全体

第二个参数就是匹配到的第一个子式，就是我们传进去的正则

第三个参数就是匹配到的第二个子式, 就是我们传的那个 id

如果我们不写正则的话，:xxx 因为只有第二个子式，没有第一个子式匹配到，就会没有，所以会取默认的([^\/]+)

```js
str = ":id"。 match = :id, regex = ""; id = id, end = 0
str = "\d+:id", match = '\d+:id', regex = "\d+", id = id, end = 0;

const paths = name.split('/').map((item) => {
    return !item
        ? ''
        : item.replace(/^(.*):([\w_]+)/, (match, regex, id, end) => {
            (this.map || (this.map = [])).push(id);
            return '(' + (regex || '[^\\/]+') + ')';
        });
});
this.regex = new RegExp("^" + paths.join('\\/') + "$", 'i');
```
