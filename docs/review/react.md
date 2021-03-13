### React 问题

1. 什么是控制反转？

   控制反转是指把对象的依赖管理从内部转移至外部，降低内部耦合，依赖注入，hoc，render props 都算控制反转。

2. HOOK 的实践(非常重要！！！)

   那有了 HOOK 之后，其实很多上述的一些方法可以用 HOOK 来改写，更加的直观。

   使用 hook 的话，配合`react context`，可以更加快速方便的管理状态。比之前也更加容易一点。

   - useCallback: 返回一个记忆持久化的函数
   - useContext: 获取上下文,
   - useEffect: 每次进来后都会执行，如果有第二个参数根据第二个参数是否发生变化决定执行与否,
   - useImperativeHandle: 配合 forwardRef 使用，具体没用过
   - useLayoutEffect: useLayoutEffect 与 useEffect 的不同在于，useLayoutEffect 会在 DOM 渲染之前执行，而 useEffect 会在 DOM 渲染之后执行，所以我们可以利用这个特性，避免一些由于 DOM 渲染之后进行操作导致的白屏问题。 useLayoutEffect 会阻塞渲染，请谨慎使用。
   - useMemo: 返回一个记忆持久化的值
   - useReducer: useState 的加强版,
   - useRef: ref 传递,
   - useState: 状态管理,
   - useDebugValue: debugger 方法

3. 为什么写 JSX 的时候，即使没用 React 也必须 import react 呢？

   因为即使写的是函数式代码，实际上 Babel 都会转译成 React.createElement,不引入的话就不能使用了。

4. this.setState 里参数是函数的时候和 Object 区别是什么

   不管是函数还是对象，最后都是合成了一个新的状态对象。return Object.assign({}, prevState, partialState);

   只是在求这个 partialSate 的时候，Object 是直接赋值，function 的话`partialState = payload.call(instance, prevState, nextProps);`

   主要的区别就是，普通的 object 里要是想使用上一次这个 state.xx 的值的话，会不准的，而通过函数式的话，人家代码内部给你上一次真实的 prevState，那就铁定不会错了。

   都还是批处理异步的。

5. this.forceUdate 是干嘛用的

   正常，`state`或者是`props`变化时，会触发`render`渲染，但是如果有些情况需要其他数据，那就可以用`forceUpdate`，调用它后会让组件强制调用`render`方法。

6. 为什么函数式组件不能使用`ref`，想用怎么办？

   因为`ref`是放在`class`实例下的，函数式组件没有实例，所以就不能使用`ref`。
   老版本里，可以再把`ref`改个名字，作为`props`传递过去。
   新版本的话,可以利用`React.forwardRef`包裹原有函数，创建一个`React`组件，加一个`ref`参数，实际上就是在`render`的时候，把这个`ref`转发下去。
   在渲染`beginwork`开始的时候，对于最外面的这个是`class`还是`function`是不知道的，当然，通过`forwardRef`的会把里面标记为`forwardRef`组件。然后在`update`的时候，`forwardRef`会把`ref`提出来，而其他`renderWithHooks`的对应位置参数是`context`，后面的和无状态组件就一样了

7. 什么是虚拟 dom

   虚拟 DOM 就是一个 JS 对象模拟 DOM 树。
   ```js
   {
        tag: 'div',
        props: {
            id: 'app'
        },
        chidren: [
        {
            tag: 'p',
            props: {
            className: 'text'
        },
            chidren: [
                'hello world!!!'
            ]
        }
        ]
   }
   ```
   因为原生操作 dom 的方式可维护性不高

   如果大批量的 innerHTML 会增大绘制时间。同时，触发回流的频率更高。

   使用虚拟 dom 相当于可以用 js 完成 UI 的驱动。可以跨平台。

   Virtual DOM 在牺牲(牺牲很关键)部分性能的前提下，增加了可维护性，这也是很多框架的通性。

   DOM 属性特别多，大部分属性对于做 Diff 是没有任何用处的，所以如果用更轻量级的 JS 对象来代替复杂的 DOM 节点，然后把对 DOM 的 diff 操作转移到 JS 对象，就可以避免大量对 DOM 的查询操作。
   
   这个更轻量级的 JS 对象就称为 Virtual DOM 。
   
   它的优势有
   
   1. 将 Virtual DOM 作为一个兼容层，让我们还能对接非 Web 端的系统，实现跨端开发。
   2. 同样的，通过 Virtual DOM 我们可以渲染到其他的平台，比如实现 SSR、同构渲染等等。
   3. 实现组件的高度抽象化

8. react fiber

   在`react16`之前，更新组件是需要递归遍历的。在协调阶段阶段，由于是采用的递归的遍历方式，这种也被成为 `Stack Reconciler`，主要是为了区别 `Fiber Reconciler` 取的一个名字。

   这种方式有一个特点：一旦任务开始进行，就无法中断，那么 `js`将一直占用主线程， 一直要等到整棵 `Virtual DOM` 树计算完成之后，才能把执行权交给渲染引擎，那么这就会导致一些用户交互、动画等任务无法立即得到处理，就会有卡顿，非常的影响用户体验。用了`Fiber`后，`Fiber`是一个链表结构，一个`FiberRoot`上可以有多个`fiber`对象，可以数据分片，配合新的`Fiber Reconciler`调度器，把整个更新任务拆解开来，把一条链表拆分为一个个工作单元，每次执行一个单元，然后通过`next`指向下一个工作单元，尽可能地将更新任务放到浏览器空闲的时候去执行，那么就能解决以上的问题。

9. react 代码分割优化 react.lazy 和 react.suspense。可以懒加载。
   TODO
10. React.createElement

    正常写 jsx 的代码会被 babel 转译成该方法，方法接收三+个参数，一个是 type,一个是 prop obj,一个是 children
    第一个参数如果是 html 标签，那就是个普通的 type，如果是一个 React 组件的话，会去判断这个 type 下有没有 defaultProps 属性，如果有的话，会给对应的 props 上默认值。
    第二个参数上来会剔除 key 和 ref，然后赋值给 prop，还有 children 也是。
    第三个+以后的参数就是 children 了，源码里会判断它的 length，如果只有一个的话 children=它，否则话 children=[]；
    最后生成一个 ReactElement 出来。
    这个对象会有一个属性\$\$typeof 标记它是一个 React 对象，type,key,ref,prop 都有

11. React 有 Component 和 pureComponent，我们写的类都是继承它的，这样我们就拥有了 setState,和 forceUpdate 方法。

    在`PureCompent`和`Component`的区别就是，`PureComponent`就是继承自`Component`,然后添加了一个原型属性`isPureComponent`代表它是`pure`，具体的判断应该就是在 react-dom 里面了。

12. setState 原理是啥？

    `setState`在调用的时候，会先判断它的第一个参数是不是一个`Obj`,或者一个`function`，如果都不是会报错，抛出一个第一个参数不能瞎传的错。

    然后会调用`react`的一个`updater`实例下的方法 `enqueueSetState`(this, partialState, callback, 'setState')

    顺便提一下，`updater`下其他几个方法本质上都是差不多的，通过`tag`来标记不同，因为在调度`beginwork`的时候，一堆差异性都是根据`tag`来做不同的操作，比如如果你是个`state`，它会更新`state`

    然后`updater`下的`enqueueSetState`的方法下，每次创建一个`update`对象，计算过期时间，把`update`对象塞进队列中，标记`next`关系，然后会走到和`render`一样的`scheduleWork`下去。

    `state`自己的话遍历更新队列，把`update`跑完，跑出最新的状态，然后在，更新到组件实例中；

    根据标识`shouldUpdate`来决定是否对组件实例进行重新渲染，而标识`shouldUpdate`的值则取决于`PureComponent`组件浅比较结果或者生命周期函数`shouldComponentUpdate`执行结果；

13. ref 是怎么把 dom 塞进 current 属性里的？

    React.createRef 生成一个只含有 current 的对象。

    然后在组件挂载的时候，给这个 current 属性存入 DOM 元素，并在卸载的时候传入 null。ref 会在 didmount 和 didupdate 触发前更新。在渲染出来后，会执行 commitAttachRef 方法，卸载的时候执行 detach 方法解除 ref。

    这个方法目前就两种方式，里面有这个 Fiber 对象节点和 ref 的对象，它会把 Fiber.stateNode 赋值给 ref.current，如果 ref 是函数的话，直接把 Fiber.stateNode 作为参数调用那个方法。

    ```js
    instanceToUse = fiber.stateNode;
    typeof ref === "function"
      ? ref(instanceToUse)
      : (ref.current = instanceToUse);
    ```

14. React.Children.map 这个方法是干嘛用的

    React.Children 提供了用于处理 this.props.children 不透明数据结构的方法，并且利用 traverseAllChildrenImplf 方法打平数组，返回的一定是一个一纬数组。

    比如 props.children 是[a,a]，可以返回[a,a,a,a];

15. React.render()方法全过程

    它会先判断第一个参数是不是一个 dom 元素，不合适直接报错。

    然后进入 legacyRenderSubtreeIntoContainer，进去后先创建一个 ReactRoot 对象。

    这个对象下有`render,unmount,legacy_renderSubtreeIntoContainer,createBatch`四个方法。

    其中，render 方法和 legacy_renderSubtreeIntoContainer，和 unmount 方法就是一个参数的区别，就是有没有 parentNode，没有调用 render 方法，有就调用 legacy_renderSubtreeIntoContainer 方法，调用 unmount，children 直接设为 null。最终都会调用一个 updateContainer 方法。

    ```js
    dom._reactRootContainer = reactRoot;
    reactRoot._internalRoot = FiberRoot;
    FiberRoot.containerInfo = dom;
    FiberRoot.current = Fiber;
    Fiber.stateNode = FiberRoot;
    ```

    Fiber 下面的树通过，`child,return,sibling`构建整颗树。

    拿到了这个`ReactRoot`后，其实就相当于和`domcontainer`绑起来了，然后就可以`render children`了，会去`unbatchUpdates`（因为`root`就一个，没必要批量更新。）的去执行对象下的`render`方法。传入`children`和`callback`。

    调用`updateContainer`方法后，会去通过一个算法求一个过期时间，这个时间越大，代表优先级越高。交互事件权重高，过期时间求出来的会更大，非交互时间权重低，求出来的会更小，你的`currentTime`越大，求出来的会越小。

    接下来带上这个过期时间，和其他参数，给`FiberRoot`对象加个`context`，然后把`Fiber`对象作为参数调用`scheduleRootUpdate`。
    `scheduleRootUpdate`方法里会创建一个`update`对象，把要渲染的`ele`放到`payload`里，通过`enqueueUpdate`把`update`插入队列中，等待执行。最后调用`scheduleWork`方法，传入`Fiber`对象和过期时间。等待调度。

16. scheduleWork()调度的原理。
    JS 和渲染引擎是一个互斥关系。（不然就乱了）。如果 JS 在执行代码，那么渲染引擎工作就会被停止。假如我们有一个很复杂的复合组件需要重新渲染，那么调用栈可能会很长

    scheduleWork 里会获取 fiberd 对象的 root，以及标记优先级，然后进入 requestWork

    判断当前任务是不是批量任务，是的话，直接 return（这个时候 root 已经被加到队列里了），等待执行。

    如果是批量任务并且不需要批量执行了，说明到下个单元任务是 null，进入 perform

    如果不是批量任务，但是是一个同步任务，直接进入 performwork

    最后，如果是一个异步任务的话，进入 performwork

    在上一个任务没执行完的情况下，判断当前任务优先级和上一个任务谁高，如果上一个高，直接等下一帧，如果当前的高，把上面的打断。
    并且高优先级的任务还可以打断低优先级的任务（因此会造成某些生命周期函数多次被执行）

    采用`react`官方自己写的`requestIdleCallback`来实现一个调度。因为本身兼容性不好，而且有一个一秒执行 20 次的限制，万一真比较空闲的话，执行不够用。所以他会去计算`requestAnimationFrame`每帧有没有空闲，有就执行自己执行任务。通过`MessageChannel`+`postMessage`来执行任务，它是个宏任务，空闲后会先执行宏任务。

    channel.port1.onmessage 会在渲染后被调用，在这个过程中我们首先需要去判断当前时间是否小于下一帧时间。如果小于的话就代表我们尚有空余时间去执行任务；如果大于的话就代表当前帧已经没有空闲时间了，这时候我们需要去判断是否有任务过期，过期的话不管三七二十一还是得去执行这个任务。如果没有过期的话，那就只能把这个任务丢到下一帧看能不能执行了

    不管是通过调度还是同步事件，还是优先级高的，最终都会调用`performWorkOnRoot`函数。
    在`performWorkOnRoot`函数里标记完成和取消的任务，进行中的调用`RenderRoot`,开始准备渲染了这个函数在异步模式下可能会被多次执行，因为在异步模式下可以打断任务。打断也就意味着每次都得回到 `root`再开始从上往下循环。

    `renderRoot`里标记下一个渲染节点，然后调用`workLoop`循环更新节点。然后`workLoop`里会判断下一个节点单元是否存在，存在就不停的调用 performUnitOfWork(nextUnitOfWork);这个方法会返回下一个节点单元。
    然后就是到了渲染自己的单元，就需要进入 beginwork 函数(后续属于真正的 diff 阶段)。判断 tag 类型来做不同的操作，比如 setState 的话就会去把实例的状态发生改变。直到下一个节点是 null 以及兄弟节点是 null 的时候，代表 work 结束。最后退出 renderRoot 代表这颗 Fiber 树已经 diff 完毕。

    renderRoot 阶段可以理解为就是 Diff 的过程，得出 Change(Effect List)，会执行声明如下的声明周期方法：

    - [UNSAFE_]componentWillMount（弃用）
    - [UNSAFE_]componentWillReceiveProps（弃用）
    - getDerivedStateFromProps
    - shouldComponentUpdate
    - [UNSAFE_]componentWillUpdate（弃用）

    由于 `reconciliation`阶段是可中断的，一旦中断之后恢复的时候又会重新执行,所以在 `reconciliation`阶段的生命周期的方法是不稳定的，我想这也是 `React`为什么要废弃 `componentWillMount`和 `componentWillReceiveProps`方法而改为静态方法 `getDerivedStateFromProps`的原因吧。

    后面的操作就是`commitRoot`后续, 把`Diff`的结果反映到真实 `DOM`的过程。

17. commit 阶段

    在 commit 阶段，在 commitRoot 里会根据 effect 的 effectTag，具体 effectTag 见源码 ，进行对应的插入、更新、删除操作，根据 tag 不同，调用不同的更新方法。

    commit 阶段会执行如下的声明周期方法：

    - getSnapshotBeforeUpdate
    - componentDidMount
    - componentDidUpdate
    - componentWillUnmount

18. diff

    做 `Diff`的目的就是为了复用节点。

    `React16`的 `diff`策略采用从链表头部开始比较的算法，是层次遍历，算法是建立在一个节点的插入、删除、移动等操作都是在节点树的同一层级中进行的。这也是为什么顶层节点发生变化后，后代所有都直接重新渲染的原因。

    利用`WorkInProgress`作为新的那颗树。

    创建 `WorkInProgress Tree` 的过程也是一个 `Diff`的过程，`Diff`完成之后会生成一个 `Effect List`，直接拿`FiberRoot.current`指向这个 `Effect List`就可以了。

    核心代码都在`ReactChildFiber.js`里

    进入`beginWork`后，会判断`tag`类型，然后执行对应的操作，对应的操作根据需要渲染与否，开始调用`reconcileChildren`方法

    `reconcileChildren`只是一个入口函数，如果首次渲染，`current`空 `null`，就通过 `mountChildFibers`创建子节点的 `Fiber`实例。如果不是首次渲染，就调用 `reconcileChildFibers`去做 `diff`，然后得出 `effect list`。

    而`mountChildFibers`和`reconcileChildFibers`就是一个参数区别，判断是否要增加一些`effectTag`，主要是用来优化初次渲染的，因为初次渲染没有更新操作。

    `reconcileChildFibers`接受四个参数

    - `returnFiber`是即将 `Diff`的这层的父节点。也就是新的节点。
    - `currentFirstChild`是当前层的第一个 `Fiber`节点。
    - `newChild`是即将更新的 `vdom`节点(可能是 `TextNode`、可能是 `ReactElement`，可能是数组)，不是 `Fiber`节点
    - `expirationTime`是过期时间，这个参数是跟调度有关系的，本系列还没讲解，当然跟 `Diff`也没有关系。

    `reconcileChildFibers`会判断传进来的第三个参数，就是即将更新的 `vdom`节点(可能是 `TextNode`、可能是 `ReactElement`，可能是数组)，不是 `Fiber`节点。

    然后调用不同的处理函数，比如当前`newChild`是一个“文本”节点，那它的类型就是一个`string`或者是`number`,调用`reconcileSingleTextNode`方法。

    判断当前层的第一个子节点是不是也是文本

    - 如果是的话，给`currentFirstChild`的所有`siblings`全打上删除的标记，然后复用当前节点，把`newChild`的内容填充到当前节点上。然后把这个节点的`return`指向`returnFiber`完成挂钩。
    - 如果不是的话，说明需要直接替换掉节点，直接从当前子节点开始，打删除标记，然后创建一个新的文本节点，并把这个节点的`return`指向`returnFiber`。

    如果是一个“元素”，也就是非文本节点的话，那它就是一个`Object`，通过它身上的\$\$`typeof`来判断它确实是一个`react`元素。调用`reconcileSingleElement`方法。

    判断当前层的第一个子节点的`key`是否和新的一样，如果一样，删除剩余节点，并复用当前节点，和`text`一样。只是多了一个`ref`的赋值过程。

    如果不一样的话，它只删除当前节点，然后标记 child = child.siblings，继续递归去判断，这样的话，如果遇到兄弟节点移位的情况，就不会浪费而是复用。

    第一种情况没有去找复用的原因是，他们的`key`相同，如果节点类型不同的话，`React`会认为你已经把这个节点重新覆盖了，所以就不会再去找剩余的节点是否可以复用。

    最终都没有找到可复用的节点的话，就会创建新节点。

    如果是一个“数组”的话，这也是最难的一块。

    那这个`fiber`对象的`index`是怎么来的，是它上一次没有比较直接替换的时候，创建`WorkInProgress`的时候，给`index`赋值的。

    这是第一次遍历新数组，通过调用 `updateSlot`来对比新老元素

    其中文本的话，如果 `key`不为 `null`，那么就代表老节点不是 `TextNode`，而新节点又是 `TextNode`，所以返回 `null`，不能复用，反之则可以复用，调用 `updateTextNode`方法。

    如果是`react`对象的话，`key`不一样就返回`null`。直接`break`出循环。
    也就是说，第一轮循环会出现三种情况。

    - 第一个情况，新节点遍历完毕，说明它是做了`pop`这样的操作。那么直接把旧节点的剩余节点给删除就可以了。
    - 第二个情况，老节点遍历完了，说明它是做了`push`这样的操作。那么直接循环创建剩下的新节点就可以了。
    - 第三个情况，新老节点都没遍历完，意思它要么做了替换操作，要么就是移动了顺序，要么就是`unshift`或者`shift`之类的操作。

    遇到这样的情况，它会通过`mapRemainingChildren`方法，把老的数组节点变成一个`map`对象。下标是`key`或者`index`。
    然后遍历新数组，在遍历的过程中会寻找新的节点的 `key`是否存在于这个 `map`中，存在即可复用，不存在就创建一个新的。就相当于又回到了第一部分。

    完成后这一层的`diff`就完成，继续下一个工作单元。直到全部结束。

19. react hook 原理

    React 下的 hook 就是封装了所有的方法，利用 dispatcher.useState 之类的直接调用。

    它在`mount`阶段主要做三件事

    1. 我们需要初始化状态，并返回修改状态的方法，这是最基本的。（这个不用说，就是方法）
       我们要区分管理每个`Hooks`。 （用 HOOK.next，workinprogresshook 来区分）
       提供一个数据结构去存放更新逻辑，以便后续每次更新可以拿到最新的值。（执行`dispatchAction`里实际上保留了之前的那个`hook`的`queue`就会创建一个保存着此次更新信息的`update`对象，添加到更新链表`queue`上。然后每个`Hooks`节点就会有自己的一个`queque`）
       每个`Hook`节点通过循环链表记住所有的更新操作
       在`update`阶段会依次执行`update`循环链表中的所有更新操作，最终拿到最新的`state`返回

    2. 使用循环链表是比如像`effect`需要从头到尾遍历链表执行
       有在最尾插入节点的需求
       循环链表只需要将表头指向最新的节点，就可以最小算法复杂度的去同时满足这两个需求

       这也是为什么不能在循环，条件或嵌套函数中调用 `Hook`， 确保总是在你的 `React`函数的最顶层调用他们。因为我们是根据调用`hook`的顺序依次将值存下去的，如果在判断逻辑循环嵌套中，就有可能导致更新时不能获取到对应的值，从而导致取值混乱。

       首先，如果这个`function component`是第一次调用进入，那`current`就是引用`mount`的那个对象。
       写多个`useState`也好，多个`useReducer`也好，会根据里面的核心`mountWorkInProgressHook`来通过链表`next`的形式，创建各个位置的`hook`的引用。

    3. 当点击了`setState`触发事件后，会执行添加进队列的那个`dispatchAction`方法，然后根据新值，赋值给`update`对象，然后触发`schedulework`，接下来，重新进入`renderHooks`函数，然后这个时候，`current`其实就已经有值了，`current`就会指向`update`的那个对象。然后`useState`也好，其它的也好，都会调用`update`对应的方法，而且会把指针指向最新的那个变更过的状态值。

20. react context

    React.createContext 其实就是返回了一个 ctx 对象，标记它的 ctx 类型

    然后添加了两个属性，一个是 Provider，一个是 Consumer，Provider 下有两个属性，一个是 provider 类型，一个是\_context 指向 ctx。Consumer 指向 ctx

    可以利用 context 来做状态管理。封装 createPage 和 inject。

21. react 所有生命周期的作用。

    - constructor 是 class 本身的，和 react 无关，但是可以作为 react 的一个初始化的函数。
    - componentWillMount 组件将要挂载
    - render 渲染
    - componentDidMount 组件挂载完成
    - static getDerivedStateFromProps 传入 nextprops 和 prevState, return 的值就是更新的 state,return null 就是不更新
      配合 componentDidUpdate 使用更佳 getDerivedStateFromProps 是一个静态方法，而组件实例无法继承静态方法，所以该生命周期钩子内部无法通过使用 this 获取组件实例的属性/方法。
    - shouldComponentUpdate 询问组件是否要更新 ->yes? componentWillUpdate-> render -> componentdidUpdate
    - componentWillUnmount 组件卸载之前

22. React 的事件机制

    React 是自己实现的一套事件机制，主要是因为

    1. 抹平浏览器之间的兼容性差异
    2. 可以跨平台了
    3. 使用事件委托，简化了 DOM 事件的处理逻辑，减少了内存开销
    4. 事件优先级分级干预

    在`diff`完毕后，会进入设置属性的函数`setInitialDOMProperties`

    这个函数的作用是判断你的`propkey`类型并决定是设置属性。还是绑定事件。

    如果你是一个事件，它内部会有一个对象包含事件属性，比如你是一个`onClick`，会进入`ensureListeninTo`方法。

    `ensureListeninTo`方法会确定事件委托的地方，比如`body`,然后调用`listenTo`方法。

    `listenTo`方法进本就是事件的入口方法，它里会获取已订阅的事件列表和依赖组，并且判断当前的事件类型有没有已经在订阅事件列表里，如果有就不再注册了，也就是说，事件处理器只需在`Document`订阅一次，所以相比在每个元素上订阅事件会节省很多资源.

    接下来会判读昂当前事件类型，是冒泡还是捕获，然后分配`trapCapturedEvent`还是`trapBubbledEvent`。像`scroll`,`focus`之类的属于捕获，而`onclick`这一的属于冒泡。

    `trapBubbleEvent`方法里会根据当前事件的优先级分配不同的`dispatch`，然后把这个`dispatch`作为`listener`真正的加入`dom`的监听事件。

    当点击的时候，都会调用`dispatchEvent`函数. `dispatchEvent`中会从`DOM`原生事件对象获取事件触发的`target`，再根据这个`target`获取关联的`React`节点实例。然后执行对应的方法。

23. hooks 缺陷

    1. 使用 Hooks 编写代码时候，你必须清楚代码中 useEffect 和 useCallback 的“依赖项数组”的改变时机。有时候，你的 useEffect 依赖某个函数的不可变性，这个函数的不可变性又依赖于另一个函数的不可变性，这样便形成了一条依赖链。一旦这条依赖链的某个节点意外地被改变了，你的 useEffect 就被意外地触发了。
    2. 一旦用了 hooks，代码量稍微多一点的情况下，大家要介入修改的话必须要整体的看完这些代码，因为 useEffect 相当于断挡了，看代码会费劲，不像 this 的时候，this.xxx，可以很容易的找到调用链。
    3. 为什么说是缓存雪崩呢？ 造成这个问题主要是因为 Hooks 函数运行是独立的，每个函数都有一份独立的作用域。函数的变量是保存在运行时的作用域里面，这里也可以理解成闭包。每次都会创建闭包数据，从性能角度来讲，此时缓存就是必要的了。而缓存就会牵扯出一堆问题。另外当我们有异步操作的时候，经常会碰到异步回调的变量引用是之前的，也就是旧的，于是就导致无法批量更新。
    4. 然后遇到实在需要存储的变量的时候，类似于挂在 this 上的时候，就需要使用 useRef + ref.current，不是很优雅
