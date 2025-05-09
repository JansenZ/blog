### Vue 问题

1. Vue 的生命周期有哪些
    <details open>

    - 完整生命周期时间线
        1. beforeCreate (Vue2) 实例初始化之后，数据观测之前。 / setup (Vue3) 组合式 API 的入口
        2. created (Vue2) 实例创建完成后被调用，此时已完成数据观测，但尚未挂载
        3. asyncData (Nuxt): 在组件加载前调用，用于获取异步数据
        4. serverPrefetch（Vue3），服务端数据预取
        5. fetch (Nuxt): 在组件加载前调用，用于获取异步数据
        6. middleware (Nuxt): 在页面渲染前执行中间件
        7. validate (Nuxt): 验证动态路由参数
        8. 以下是CSR专属
        9. beforeMount (Vue2) / onBeforeMount (Vue3) 组件挂载到节点之前执行
        10. mounted (Vue2) / onMounted (Vue3) 组件挂载完成后执行
        11. beforeUpdate (Vue2) / onBeforeUpdate (Vue3) 组件更新之前执行
        12. updated (Vue2) / onUpdated (Vue3) 组件更新完成之后执行
        13. beforeDestroy (Vue2) / onBeforeUnmount (Vue3) 组件卸载之前执行
        14. destroyed (Vue2) / onUnmounted (Vue3) 组件卸载完成之后执行
        15. 以下SSR也会有
        16. onErrorCaptured (Vue3): 捕获后代组件错误时执行
        17. onRenderTracked (Vue3): 跟踪虚拟 DOM 重新渲染时执行
        18. onRenderTriggered (Vue3): 触发虚拟 DOM 重新渲染时执行
    - ![图片](https://cn.vuejs.org/assets/lifecycle_zh-CN.W0MNXI0C.png)

2. 使用 Compositon API 需要注意什么？

    <details open>
    [探索 composition API](https://segmentfault.com/a/1190000040144197)

    - 使用 setup 来替代之前的除 props 的所有 options，比如 data、 methods、 computed 等等
    - 使用 ref 和 reactive 来给数据添加响应式处理， 其中 ref 针对值类型，reactive 针对对象类型。需要注意的是，使用 reactive 的时候，不要在返回的时候解构，因为这样会使它失去响应式，这也很容易理解，mobx 也是类似的。
    - 如果解构了，又不希望失去响应式，需要使用 toRefs 方法，但是它也是浅拷贝，所以谨慎使用
    - 如果已经是 Ref 响应式数据了，除在 template 和 watch 中使用是直接使用，在内部使用的时候需要 .value
    - 使用 unref 可以肯定得到值而不是 ref。因为很多时候，你需要的就是 ref 和非 ref 联合操作，如果一个.value，一个没有，会很麻烦，所以直接用 unref 方便很多

        ```js
        funcion unref(r) {
            return isRef(r) ? r.value : r;
        }
        ```

    - 如果一个变量已经是 ref 后，再次对他进行 ref 是没关系的，会直接复用，也就是说,ref 的 function 里应该是

        ```js
        function ref(r) {
            return isRef(r) ? r : realRef(r);
        }
        ```

3. 以下代码在 vue2 和 vue3 中表现有啥区别？

    ```js
    export default {
      data() {
         return {
             testObj: {
                 name: 1
             }
         }
      },
      mounted() {
        this.test()
      },
      methods() {
         test() {
             const newObj = {}
             this.testObj = newObj
             // 别看这句话在这里执行，不管在vue2还是vue3，实际触发监听的时候，这个name已经挂在对象上了。
             newObj.name = 2
             console.log('%c==============', 'color: red', newObj === this.testObj)
         }
      }
    }
    ```

    <details open>

    大模型对 Vue 的理解很一般，错误百出，所以 Vue 问题一定要慎用，不同的大模型答案是不一样的，一定要自己实验。

    以上的代码，模版上 testObj.name 都会输出 2，但是在 vue2 中，console.log 会打印出 true，这是因为当对 this.testObj 重新进行对象赋值，Object.defineProperty 对 newObj 转化为响应式对象，但是他们还是同一个引用。而在 vue3 中，console.log 会打印出 false。这是因为 vue3 中的响应式对象是 Proxy 代理对象。当重新赋值的时候，Proxy 代理对象会重新创建一个新的对象。这个和原始对象是不一样的。可以用个例子说明

    ```js
    // vue2
    var obj = { name: '7' };

    let initialValue = obj.name;
    Object.defineProperty(obj, 'name', {
        // getter：当访问属性时触发
        // 这里不能写obj.name,否则会陷入死循环，因为Obj.name本身就会调用getter
        get() {
            console.log('访问了 name 属性');
            return initialValue;
        },
        // setter：当修改属性时触发
        set(value) {
            console.log(`设置了 name 属性，值为：${value}`);
            initialValue = value;
        }
    });
    var newObj = {};
    obj = newObj; // 在vue2中，它会再执行一次Object.defineProperty。这个时候newObj肯定也是被拦截的了。
    // 所以这个时候修改newObj.name，等同与修改obj.name
    obj === newObj; // true。

    // vue3
    var obj = { name: '6' };
    var proxy = new Proxy(obj, {
        get(target, prop) {
            return target[prop];
        }
    });
    console.log(proxy === obj); // false
    var newObj = {};
    proxy = newObj; // 在此时，proxy和newObj是全等的。
    // 但是vue的上一级感知到了你的proxy的变化，进行重新代理。
    proxy = new Proxy(proxy, {
        get(target, prop) {
            return target[prop];
        }
    });
    //  这个时候proxy已经是Proxy对象了，代理了newObj
    newObj.name = '7';
    // 所以proxy当然能感知到newObj的变化
    proxy === newObj; // false
    ```

4. 看如下代码

    ```js
    // <button :disabled="isApplying">立即申请</button>
    function go() {
        this.isApplying = '';
    }
    ```

    在 `vue` 中，以上的代码，如果你的 `v-bind` 的 `attr` 是一个布尔类型，那么当 `isApplying` 是 `true` 或者是空字符串的时候,元素都会包含这个`disabled attribute`。所以最好的办法就是 `:disabled="!!isApplying"` 。防止出现不可控的状况。

5. Vuex 是什么？

    <details open>

    Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式 + 库。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

    - 核心概念

        1. **State**: 单一状态树，存储应用的所有状态
        2. **Getters**: 从 state 中派生出一些状态，类似计算属性
        3. **Mutations**: 更改 state 的唯一方法，必须是同步函数
        4. **Actions**: 提交 mutation，可以包含异步操作
        5. **Modules**: 将 store 分割成模块，每个模块拥有自己的 state、mutation、action、getter

    - 工作流程

        1. 组件通过 `dispatch` 触发 action
        2. action 中可以执行异步操作，完成后通过 `commit` 提交 mutation
        3. mutation 直接修改 state
        4. state 变化后，通过响应式系统触发视图更新

6. Vuex 和 Pinia 区别是什么？

    <details open>

    - 核心区别

    | 特性            | Vuex                            | Pinia                |
    | --------------- | ------------------------------- | -------------------- |
    | 状态管理方式    | 集中式                          | 分散式               |
    | 模块化          | 需要手动配置                    | 自动模块化           |
    | TypeScript 支持 | 需要额外配置                    | 原生支持             |
    | 代码量          | 较多（需要写 mutation、action） | 较少（直接定义方法） |
    | 开发体验        | 较复杂                          | 更简单直观           |
    | 性能            | 相对较重                        | 更轻量               |
    | 调试工具        | Vue Devtools                    | Vue Devtools         |
    | 学习曲线        | 较陡峭                          | 较平缓               |

    - 如果只是简单的全局状态，完全可以使用 Pinia, 如果是 vue3 甚至可以考虑更轻量的方案，当然要考虑是团队协作，所以最好还是用 pinia。

    ```javascript
    // 使用 provide/inject
    const globalState = reactive({
        count: 0
    });
    provide('globalState', globalState);

    // 在组件中使用
    const state = inject('globalState');
    ```

    - 具体差异

    1. **API 设计**：

        ```javascript
        // Vuex
        const store = new Vuex.Store({
            state: {
                count: 0
            },
            mutations: {
                increment(state) {
                    state.count++;
                }
            },
            actions: {
                incrementAsync({ commit }) {
                    setTimeout(() => {
                        commit('increment');
                    }, 1000);
                }
            },
            getters: {
                doubleCount: (state) => state.count * 2
            }
        });

        // Pinia
        export const useCounterStore = defineStore('counter', {
            state: () => ({
                count: 0
            }),
            actions: {
                increment() {
                    this.count++;
                },
                async incrementAsync() {
                    setTimeout(() => {
                        this.increment();
                    }, 1000);
                }
            },
            getters: {
                doubleCount: (state) => state.count * 2
            }
        });
        ```

    2. **模块化方式**：

        ```javascript
        // Vuex 模块化
        const moduleA = {
            state: () => ({ ... }),
            mutations: { ... },
            actions: { ... },
            getters: { ... }
        }
        const moduleB = {
            state: () => ({ ... }),
            mutations: { ... },
            actions: { ... },
            getters: { ... }
        }
        const store = new Vuex.Store({
            modules: {
                a: moduleA,
                b: moduleB
            }
        })

        // Pinia 模块化
        export const useStoreA = defineStore('a', { ... })
        export const useStoreB = defineStore('b', { ... })
        ```

    3. **TypeScript 支持**：

        ```typescript
        // Vuex 需要额外配置
        interface State {
            count: number
        }
        const store = new Vuex.Store<State>({ ... })

        // Pinia 原生支持
        interface State {
            count: number
        }
        export const useStore = defineStore('main', {
            state: (): State => ({
                count: 0
            })
        })
        ```

7. computed 为什么是只读属性？能修改吗？
    <details open>

    ```js
    const firstName = ref('John');
    const lastName = ref('Doe');

    const fullName = computed({
        get() {
            return `${firstName.value} ${lastName.value}`;
        },
        set(newValue) {
            const names = newValue.split(' ');
            firstName.value = names[0] || '';
            lastName.value = names[1] || '';
        }
    });

    // 用户输入修改 fullName
    fullName.value = 'Jane Smith';
    ```

    在这种场景下，setter 的合理性在于它简化了修改逻辑，避免了手动操作 ref。
    但是，给 computed 设置 setter 在某种程度上确实违背了其初衷。computed 的核心设计是用于派生状态，而不是直接修改状态，破坏了单向数据流性，模糊了 computed 的职责，可能影响性能（缓存机制被破坏）

8. Vue2 和 Vue3 的区别？
    <details open>

    - 响应式系统
        - Vue2: 使用 Object.defineProperty 实现响应式，无法监听新增属性和删除属性。
        - Vue3: 使用 Proxy 实现响应式，能够监听新增属性和删除属性，性能更高。
    - Composition API
        - Vue2: 使用 Options API，逻辑分散在 data、methods、computed 等选项中。
        - Vue3: 引入 Composition API，使用 setup 函数集中管理逻辑，更适合逻辑复用和复杂组件开发。
    - 性能优化
        - Vue2: 模板编译器生成的代码较为冗余，运行时性能稍低。
        - Vue3: 模板编译器生成更高效的代码，运行时性能更高。
    - TypeScript 友好
        - Vue2: TypeScript 支持较弱，需要结合 vue-class-component vue-property-decorator
        - Vue2: 如果在 Nuxt 中，需要结合 @nuxt/types @nuxt/typescript-build nuxt-property-decorator
        - Vue3: TypeScript 支持更友好，类型定义更加完善。

9. Vue2 和 Vue3 针对模版编译有哪些区别?[Vue3 编译优化](https://cloud.tencent.com/developer/article/2224683)
    <details open>

    - 编译器架构涉及区别
        - Vue2 的编译器是一个整体设计，编译过程紧耦合，难以扩展。
            1. 解析(Parse): 将模板字符串转换为 AST 抽象语法树。
            2. 优化(Optimize): 对 AST 进行静态标记优化和代码优化。
            3. 代码生成(Codegen): 将优化后的 AST 转换为可执行的 JavaScript 代码。
        - Vue3 的编译器是模块化设计，编译过程松耦合，灵活性更高。
            1. 解析(Parse): 将模板字符串转换为 AST 抽象语法树。
            2. 转换(Transform): 对 AST 进行转换和优化。
            3. 代码生成(Codegen): 将转换后的 AST 转换为可执行的 JavaScript 代码。
    - AST 生成差异
        1. **解析过程**：Vue 2 在浏览器环境下通过内部的 HTML 解析器（parseHTML）递归解析模板，将标签、文本、注释等节点转为 AST 节点。Vue 3 同样首先使用词法/语法分析器（baseParse）将模板字符串解析为抽象语法树，但代码基于 TypeScript 重写，模块化程度更高 ​。
        2. **AST 节点结构**：Vue 2 中，元素节点的 AST 包含 tag、attrsList（属性列表）、attrsMap、children 等字段，还会有 static、staticRoot、staticInFor、pre、for 等标记属性，用于优化阶段的判断。Vue 3 的元素节点定义主要字段包括 type、tag、props（属性数组）、children 等。Vue 3 AST 使用枚举类型（如 NodeTypes、ElementTypes）标识节点类型，并在节点上附加 shapeFlag（节点分类）和 patchFlag 等标志。相比之下，Vue 2 在 AST 中并不使用枚举类型，更多依赖布尔字段和上下文来区分节点类型。示例差异：Vue 2 生成的 AST 可能有 attrsList 和 attrsMap 字段，而 Vue 3 用统一的 props 数组代替；Vue 2 通过 pre: true 标识 \<pre> 模板块，而 Vue 3 有 tagType 明确表示元素类型。
        3. **静态标记**：在解析结束后，Vue 2 会对 AST 做一次遍历标记，把完全静态的节点（例如纯文本、没有绑定的属性等）标记为 static = true，并找出静态根节点标记 staticRoot = true。这些标记随后在代码生成阶段使用。Vue 3 的编译器在 transform 阶段也会对 AST 进行分析，通过调用类似 hoistStatic 的转换将静态子树提升为常量，并在节点上设置标记（例如 node.hoisted = true）。
    - 静态标记优化策略差异

        1. **静态标记**, 在 Vue2 中，编译器会遍历 AST，将不依赖响应式数据的节点标记为静态并提取到 staticRenderFns 数组。运行时渲染时，静态树通过缓存 staticRenderFns 节点跳过重新创建。缺点是对于复杂的静态结构（如嵌套对象、数组等）无法完全优化。而且需要注意的是，staticRenderFns[] 中，只在初次渲染时调用。在运行阶段的时候，这些静态节点并没有什么用，还是会全量参与 patch 操作

            ```js
            function markStatic(node) {
                node.static = isStatic(node);
                if (node.type === 1) {
                    for (let i = 0; i < node.children.length; i++) {
                        markStatic(node.children[i]);
                    }
                }
            }
            ```

        2. **静态提升**: Vue 3 引入了静态提升机制（hoistStatic），即将编译时确定为静态的节点在渲染函数外部创建为常量变量（如 \_hoisted_1 = createVNode("div", null, "静态内容")），避免每次更新时重复创建 VNode​。这样一来，静态节点在后续更新时直接复用同一个引用，渲染器可以跳过它们的更新过程。

            ```js
            function hoistStatic(root: RootNode, context: TransformContext) {
                traverse(root, {
                    enter(node) {
                        if (isStaticNode(node)) {
                            context.hoist(node);
                        }
                    }
                });
            }
            ```

        3. **动态标记(PatchFlag)**: Vue 3 在模板编译阶段对每个 VNode 计算 PatchFlag（位图标记），以表征节点或属性的动态变化类型。常见的 PatchFlag 如 TEXT = 1（动态文本）、CLASS = 2（动态 class）、STYLE = 4 等 ​。在生成 VNode 调用时，将 PatchFlag 作为参数传入，例如动态文本节点的渲染函数会传入 1 。运行时如果某个节点的 PatchFlag 不为 0，则说明该节点存在动态内容，需要更新；若为 0，则可跳过深度遍历，从而加快 diff 性能 ​。Vue 2 不存在 PatchFlag 概念。并且 Vue 3 编译器还引入了"Block Tree"机制，对动态节点进行分组，便于 diff 阶段处理动态子树。此外，还支持预字符串化（pre-stringify）：当模板中存在大量连续静态节点时，编译器可将其序列化为一个大的静态字符串，并生成一个特殊的 Static VNode，从而减少大量 VNode 的创建 。

    - 渲染函数生成差异

    ```js
    <div id="app">
        <p>静态文本</p>
        <span>{{ count }}</span>
    </div>;

    // vue2
    with (this) {
        return _c('div', { attrs: { id: 'app' } }, [
            _c('p', [_v('静态文本')]),
            _c('span', [_v(_s(count))])
        ]);
    }
    // 每次渲染时，Vue2 会重新执行渲染函数，生成一棵新的虚拟 DOM 树。也就是说静态节点虽然被标记为静态，但仍然需要在运行时参与虚拟 DOM 的创建。
    // 新旧虚拟 DOM 树会通过 diff 算法进行对比，找出差异并更新真实 DOM。

    // vue3
    const _hoisted_1 = /*#__PURE__*/ createElementVNode('p', '静态文本', 1);

    function render(_ctx, _cache) {
        return (
            // 标记一个动态更新的 Block。
            openBlock(),
            // 创建一个 Block 节点。
            createElementBlock('div', { id: 'app' }, [
                _hoisted_1,
                // 创建一个普通的虚拟 DOM 节点。
                createElementVNode('span', null, toDisplayString(_ctx.count), 1)
            ])
        );
    }
    // Vue3 的渲染函数会在运行时通过 Block Tree 精确定位需要更新的动态节点。而静态节点会被直接复用
    ```

    以上面代码为例，Vue2 再更新时，整个模板重新执行 render()，生成新 VNode 树 → 与旧 VNode 树比较 → patch 所有节点，而 Vue3 运行时只会更新 span，完全跳过 p 节点，因为 p 是完全静态的。

    Vue 2 的机制虽然简单直接，但存在作用域污染、性能优化能力差等缺陷。Vue 3 的目标是将模板编译输出转化为"高度优化、可静态分析、可组合"的函数代码。

10. Vue2 的 Dom 更新原理
    <details open>

    - Vue2 流程图。

    ```js
    data.message = 'hello'
    → dep.notify()
    → watcher.update()
    → watcher.run()  // 触发 render()
    → newVNode = render()
    → patch(oldVNode, newVNode)
    ```

    - Vue2 patch 的步骤
        1. 先看节点是否相同，如果不同，直接找到旧节点的父亲，然后插入新节点，并删除旧节点
        2. 如果节点相同，则进行 patchVnode，patchVnode 的逻辑是：
            1. 如果新节点是文本节点，则直接更新文本内容
            2. 如果只有新节点有子节点，则添加子节点
            3. 如果只有旧节点有子节点，则删除子节点
            4. 如果新旧节点都有子节点，则进行 updateChildren
    - updateChildren 的核心算法是
        1. 进 while 循环，判断新旧 startIdx 都要小于新旧 endIdx
        2. 头头比较，如果新旧节点头部一样，那就把头节点进 patchVnode 比较，然后新旧 idx++
        3. 尾尾比较，如果新旧节点尾部一样，那就把尾节点进 patchVnode 比较，然后新旧 idx--
        4. 头尾比较，如果旧节点头部和新节点尾部一样，那就把旧节点头部和新节点尾部进 patchVnode 比较，然后移动旧节点头部到尾部位置，然后旧 idx++，新 idx--
        5. 尾头比较，如果旧节点尾部和新节点头部一样，那就把旧节点尾部和新节点头部进 patchVnode 比较，然后移动旧节点尾部到头部位置，然后旧 idx--，新 idx++
        6. 如果以上四种情况都不满足，则遍历旧节点，找到与新节点头部相同的节点，然后进 patchVnode 比较，然后移动旧节点到目标为止，然后旧 idx++，新 idx++。
        7. 如果遍历不到，直接创建新节点，然后插入到旧节点的开始前。
        8. 出 while 循环
        9. 判断新节点是否还有剩余，如果有剩余，则创建新节点，然后插入到旧节点的最后。
        10. 判断旧节点是否还有剩余，如果有剩余，则删除旧节点。

    ```js
    // Diff算法实现
    function patch(oldVnode, vnode) {
        // 如果oldVnode是真实DOM，则创建对应的虚拟DOM
        if (!oldVnode.tag) {
            oldVnode = emptyNodeAt(oldVnode);
        }

        // 如果新旧节点相同，则进行更新
        if (sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode);
        } else {
            // 如果节点不同，则替换整个节点
            const parent = oldVnode.elm.parentNode;
            const elm = createElm(vnode);
            parent.insertBefore(elm, oldVnode.elm);
            parent.removeChild(oldVnode.elm);
        }
    }

    // 判断两个节点是否相同
    function sameVnode(vnode1, vnode2) {
        return vnode1.key === vnode2.key && vnode1.tag === vnode2.tag;
    }

    // 更新节点
    function patchVnode(oldVnode, vnode) {
        const elm = (vnode.elm = oldVnode.elm);
        const oldCh = oldVnode.children;
        const ch = vnode.children;

        // 如果新节点是文本节点
        if (vnode.text) {
            if (oldVnode.text !== vnode.text) {
                elm.textContent = vnode.text;
            }
        } else {
            // 如果新节点有子节点
            if (oldCh && ch) {
                // 更新子节点
                updateChildren(elm, oldCh, ch);
            } else if (ch) {
                // 如果只有新节点有子节点，添加子节点
                addVnodes(elm, null, ch, 0, ch.length - 1);
            } else if (oldCh) {
                // 如果只有旧节点有子节点，删除子节点
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
        }
    }

    // 更新子节点
    function updateChildren(parentElm, oldCh, newCh) {
        let oldStartIdx = 0;
        let newStartIdx = 0;
        let oldEndIdx = oldCh.length - 1;
        let newEndIdx = newCh.length - 1;
        let oldStartVnode = oldCh[0];
        let newStartVnode = newCh[0];
        let oldEndVnode = oldCh[oldEndIdx];
        let newEndVnode = newCh[newEndIdx];

        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (!oldStartVnode) {
                oldStartVnode = oldCh[++oldStartIdx]; // 跳过已处理的旧节点
            } else if (!oldEndVnode) {
                oldEndVnode = oldCh[--oldEndIdx]; // 跳过已处理的旧节点
            } else if (sameVnode(oldStartVnode, newStartVnode)) {
                // 头头比较
                patchVnode(oldStartVnode, newStartVnode);
                // 下标后移
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            } else if (sameVnode(oldEndVnode, newEndVnode)) {
                // 尾尾比较
                patchVnode(oldEndVnode, newEndVnode);
                // 下标前移
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldStartVnode, newEndVnode)) {
                // 头尾比较
                patchVnode(oldStartVnode, newEndVnode);
                // 移动节点，把旧头移到尾部对齐
                parentElm.insertBefore(
                    oldStartVnode.elm,
                    oldEndVnode.elm.nextSibling
                );
                // 旧节点下标后移，新节点下标前移
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldEndVnode, newStartVnode)) {
                // 尾头比较
                patchVnode(oldEndVnode, newStartVnode);
                // 移动节点，把旧尾移到头部对齐
                parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
                // 旧节点下标前移，新节点下标后移
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            } else {
                // 查找新节点在旧节点中的位置
                const idxInOld = findIdxInOld(
                    newStartVnode,
                    oldCh,
                    oldStartIdx,
                    oldEndIdx
                );
                // 如果能找到，则移动节点
                if (idxInOld) {
                    const vnodeToMove = oldCh[idxInOld];
                    patchVnode(vnodeToMove, newStartVnode);
                    // 旧节点旧位置置空
                    oldCh[idxInOld] = undefined;
                    parentElm.insertBefore(vnodeToMove.elm, oldStartVnode.elm);
                } else {
                    // 创建新节点，并插入到旧节点的开始位置
                    createElm(newStartVnode, parentElm, oldStartVnode.elm);
                }
                // 新节点后移
                newStartVnode = newCh[++newStartIdx];
            }
        }

        // 处理剩余节点
        if (oldStartIdx > oldEndIdx) {
            // 添加新节点
            addVnodes(parentElm, null, newCh, newStartIdx, newEndIdx);
        } else if (newStartIdx > newEndIdx) {
            // 删除旧节点
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
    }
    ```

11. Vue3 的 Dom 更新原理是什么？

    <details open>

    - 基本和 vue2 一样，但是 vue3 的 diff 算法进行了优化，基于 PatchFlag 精确更新，比 vue2 的全量递归对比要好很多，然后它的 diff 算法中的核心区别，就是 Vue2 的 diff 算法会直接遍历新旧节点的中间部分，通过 find 方法查找新节点是否存在于旧节点中。Vue2 的 find 方法是线性查找，时间复杂度为 O(n^2)（因为需要遍历新节点和旧节点）。
    - Vue3 的 diff 算法在处理中间部分时，会先构建一个映射表（keyIndex），快速定位新节点在旧节点中的位置。然后通过 最长递增子序列（LIS）算法，优化节点的移动操作。
    - LIS 算法可以找到新节点的最优移动顺序，减少不必要的 DOM 操作。时间复杂度为 O(n log n)，相比 Vue2 的 O(n^2)，性能提升显著。

    ```js
    // 假设旧节点和新节点如下：
    const oldChildren = [{ key: 'c' }, { key: 'd' }, { key: 'e' }];
    const newChildren = [{ key: 'e' }, { key: 'c' }, { key: 'd' }];

    // 构建映射表：keyIndex = { 'e': 0, 'c': 1, 'd': 2 }
    // 旧节点的索引：source = [1, 2, 0] （表示新节点在旧节点中的位置）
    // LIS = [1, 2] （最长递增子序列，表示 'c' 和 'd' 的顺序是正确的）

    // 处理逻辑：
    // - 'e' 不在 LIS 中，需要移动到正确的位置
    // - 'c' 和 'd' 在 LIS 中，保持顺序不变
    ```

12. Vue computed 的原理是什么？

     <details open>

    - Vue2 的 computed 实现（简化版理解）

    ```javascript
    /**
     * 核心思想：
     * 1. 计算属性就是一个"懒人"，它依赖的数据变化了才重新计算
     * 2. 依赖收集就是"记账"，记录谁依赖了谁
     * 3. 更新就是"通知"，数据变了就通知依赖它的人
     */

    // 举个实际例子
    const vm = new Vue({
        data: {
            firstName: '张',
            lastName: '三'
        },
        computed: {
            fullName() {
                return this.firstName + this.lastName;
            }
        }
    });
    ```

    执行流程：

    1. **初始化阶段**：

        - 创建`fullName`的"记账本"（Watcher）
        - 设置当前正在"记账"的是`fullName`（Dep.target = fullName）
        - 执行`fullName`的计算函数，访问`firstName`和`lastName`
        - `firstName`和`lastName`在自己的"记账本"上记下`fullName`依赖它们
        - 记账完成，清空当前记账人

    2. **使用阶段**：

        - 访问`vm.fullName`
        - 检查是否需要重新计算（dirty 标记）
        - 如果需要，重新计算并缓存结果
        - 如果不需要，直接返回缓存的值

    3. **更新阶段**：
        - 修改`firstName = '李'`
        - `firstName`翻看自己的"记账本"，发现`fullName`依赖它
        - 通知`fullName`："我变了，你要重新计算"
        - `fullName`设置 dirty 为 true，下次访问时重新计算

    - Vue3 的 computed 实现（简化版理解）

    ```javascript
    /**
     * 核心思想：
     * 1. 使用Proxy监听数据变化，比Vue2的Object.defineProperty更强大
     * 2. Effect系统就是"副作用"，数据变化会触发相应的"副作用"
     * 3. 依赖收集更精确，性能更好
     */

    const state = reactive({
        firstName: '张',
        lastName: '三'
    });

    const fullName = computed(() => {
        return state.firstName + state.lastName;
    });
    ```

    执行流程：

    1. **初始化阶段**：

        - 创建`fullName`的"副作用"（Effect）
        - 设置当前正在收集"副作用"的是`fullName`（activeEffect = fullName）
        - 执行计算函数，访问`firstName`和`lastName`
        - `firstName`和`lastName`记录`fullName`这个"副作用"
        - 收集完成，恢复之前的"副作用"收集者

    2. **使用阶段**：

        - 访问`fullName.value`
        - 检查是否需要重新计算（dirty 标记）
        - 如果需要，执行"副作用"函数重新计算
        - 如果不需要，直接返回缓存的值

    3. **更新阶段**：
        - 修改`state.firstName = '李'`
        - Proxy 捕获到变化，触发更新
        - 找到所有依赖`firstName`的"副作用"
        - 执行这些"副作用"，重新计算值

    - 主要区别

    1. **响应式实现**：

        - Vue2：使用`Object.defineProperty`，需要遍历对象属性
        - Vue3：使用`Proxy`，可以直接监听对象变化

    2. **依赖收集**：

        - Vue2：使用`Watcher`和`Dep`，依赖关系存储在对象中
        - Vue3：使用`Effect`系统，依赖关系存储在`WeakMap`中

    3. **性能优化**：
        - Vue2：依赖收集相对粗糙
        - Vue3：依赖收集更精确，性能更好

    虽然实现方式不同，但核心思想是一样的：

    4. 记录谁依赖谁（依赖收集）
    5. 数据变化时通知依赖方（响应式更新）
    6. 避免重复计算（缓存机制）

13. Vue 响应式的本质是什么？

    <details open>

    Vue 响应式系统的核心本质是：**依赖收集和通知更新**。具体来说：

    ```javascript
    /**
     * Vue响应式系统的核心实现：
     * 1. 依赖收集（getter）：记录"谁在依赖我"
     * 2. 通知更新（setter）：数据变化时通知"依赖我的人"
     * 3. 缓存优化：避免重复计算
     */

    // 1. 存储当前正在收集依赖的观察者
    let activeWatcher = null;

    // 2. 依赖类
    class Dep {
        constructor() {
            this.subscribers = new Set(); // 存储所有依赖这个数据的观察者
        }

        // 收集依赖
        depend() {
            if (activeWatcher) {
                this.subscribers.add(activeWatcher);
            }
        }

        // 通知更新
        notify() {
            this.subscribers.forEach((watcher) => watcher.update());
        }
    }

    // 3. 观察者类
    class Watcher {
        constructor(getter) {
            this.getter = getter;
            this.value = this.get();
        }

        get() {
            // 设置当前正在收集依赖的观察者
            activeWatcher = this;
            // 执行getter，触发依赖收集
            const value = this.getter();
            // 清空当前观察者
            activeWatcher = null;
            return value;
        }

        update() {
            this.value = this.get();
        }
    }
    ```

    - Watcher 的三种主要用途

    ```javascript
    /**
     * Watcher（观察者）的三种主要用途：
     * 1. 计算属性（computed）
     * 2. 监听器（watch）
     * 3. 渲染函数（render）
     */

    // 1. 计算属性Watcher
    const computedWatcher = new Watcher(
        () => {
            // 计算属性的getter
            return this.firstName + this.lastName;
        },
        {
            lazy: true, // 懒执行
            computed: true // 标记为计算属性
        }
    );

    // 2. 监听器Watcher
    const watchWatcher = new Watcher(
        () => {
            // watch的getter
            return this.count;
        },
        {
            handler(newVal, oldVal) {
                // watch的回调函数
                console.log('count变化了', newVal, oldVal);
            }
        }
    );

    // 3. 渲染Watcher
    // Vue模板依赖收集的过程：
    // * 1. 每个组件都有一个渲染Watcher
    //  * 2. 渲染时，这个Watcher会被设置为当前活跃的Watcher
    //  * 3. 模板中访问的任何响应式数据都会收集这个渲染Watcher
    const renderWatcher = new Watcher(() => {
        // 渲染函数
        return this.$createElement('div', this.message);
        // 编译后的渲染函数是这样的，所以本质上都是js，需要收集依赖。
        function render() {
            return h('div', [
                h('p', this.count), // 访问count
                h('span', this.message) // 访问message
            ]);
        }
    });
    ```

    - 主要区别

    | 特性        | 计算属性 Watcher                  | 监听器 Watcher            | 渲染 Watcher                    |
    | ----------- | --------------------------------- | ------------------------- | ------------------------------- |
    | 缓存机制    | 有（dirty 标记）                  | 无                        | 无                              |
    | 执行时机    | 懒执行（访问时计算）              | 立即执行                  | 立即执行                        |
    | 主要用途    | 派生状态                          | 执行副作用（如 API 调用） | 更新视图                        |
    | update 行为 | 只设置 dirty 标记，不立即重新计算 | 直接执行回调函数          | 重新执行 render + 虚拟 DOM diff |
    | 依赖关系    | 依赖其他响应式数据                | 监听特定数据变化          | 依赖模板中使用的所有数据        |

14. v-for 其实可以用 of 替代 in，更符合直觉，如何理解？

    <details open>

    v-for 遍历数组/对象的时候，默认获取的是数组项/对象的值，也就是说，实际上是和 js 中的 for of 是一样的。但是 vue2 的语法却是 `v-for="(item, index) in items"`，这和 js 的 for in 不一样。所以在 vue3 的时候，鱿鱼须改了写法，vue3 是可以写 v-for of 的。和 v-for in 是完全一样的。

15. watch 和 computed 的区别是什么？

    <details open>

    - computed：用于派生状态。它的主要功能是从现有的响应式数据中计算出一个新的值，并且这个值会根据依赖的变化自动更新。
    - watch：用于执行副作用。它的主要功能是监听响应式数据的变化，并在变化时执行特定的逻辑（通常是副作用，比如 API 调用、日志记录等）。
    - 简单来说一个是获取值，一个是动作。如果需要计算值并在模板中使用，选择 computed；如果需要监听数据变化并执行副作用，选择 watch。

16. Vue 如何写一个插件？
    <details open>

    ```js
    // 定义插件
    const MyPlugin = {
        install(Vue, options) {
            // 添加全局方法
            Vue.prototype.$myMethod = function () {
                console.log('这是一个插件方法');
            };

            // 添加全局指令
            Vue.directive('focus', {
                inserted(el) {
                    el.focus();
                }
            });

            // 添加混入
            Vue.mixin({
                created() {
                    console.log('插件混入的生命周期钩子');
                }
            });

            // 注册全局组件
            Vue.component('my-component', {
                template: '<div>这是一个插件组件</div>'
            });

            // 添加全局过滤器
            Vue.filter('capitalize', function (value) {
                if (!value) return '';
                value = value.toString();
                return value.charAt(0).toUpperCase() + value.slice(1);
            });
        }
    };

    // 使用插件
    import Vue from 'vue';
    Vue.use(MyPlugin, { someOption: true });
    ```

17. Vue 中需要注意的小 tips

    1. v-show 不支持 `<template>` 元素，也不支持 `v-else`。
    2. 一般来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。
    3. v-for 和 v-if 当它们处于同一节点，v-for 的优先级比 v-if 更高，这意味着 v-if 将分别重复运行于每个 v-for 循环中
