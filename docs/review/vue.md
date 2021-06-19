### Vue 学习笔记

笔记内容偏文档学习记录点，后面完全应用后会针对性的重写。
深度相对于 react 而言会低非常的多。

1. 在 2.x 版本中，只有给初始属性才会进行监听，后续新增属性不能监听。其实就是因为 defineProperty 的特性
2. 不要在选项 property 或回调上使用箭头函数
3. 生命周期有
    1. beforeCreate
    2. create
    3. beforeMount
    4. mounted
    5. beforeUpdate
    6. updated
    7. beforeDestroy
    8. destoryed
4. v-once 一次性插值。只同步一次。
5. v-html 输出原始 html，类似 `dangerouslySetInnerHTML`
6. Vue 的文本内容可以使用{{}} 来完成变量指定，但是对于标签内的，基本都需要用指令来完成，v-bind:
7. 如果在 v-bind: 内需要使用拼接，那么字符串用单引号 `<div v-bind:id="'list-' + id"></div>`
8. v-if 替代 { && }
9. v-on: 替代 onXxx
10. 动态参数：v-bind: [xxxName], v-on: [xxxName]
11. 动态参数表达式有限制，不能在里面计算，需要拿外面来（为什么？原理探究）
12. 修饰符，比如要在 v-on:click.prevent，其实就是会调用 preventDefault
13. v-bind 缩写就是：
14. v-on 缩写就是@
15. 利用 computed 的替代{{}}中的计算。其实类似 mobx 中的 computed，又是发布者又是订阅者？（需要去看原理）那么它作为订阅者来说，依赖变了它也会变。
16. watch 属性，对象，监听属性变化，第一个参数就是变化后的值，需要和 computed 酌情区分使用
17. computed 默认只有 getter，也可以添加一个 setter。
18. watch 其实就有点类似于 hooks 利的依赖项参数
19. 除了在 vm 里使用 watch 选项，也 可以对实例进行 vm.$watch。$就是内部属性。
20. V-bind：class 有特有的增强语法 "{ active: isActive, 'text-danger': hasError }“，当然使用 computed 返回更合适的多，毕竟直接返回 object。显的更加舒服。
21. :class 也可以跟数组使用
22. v-show  不支持  <template>  元素，也不支持  v-else。
23. 一般来说，v-if  有更高的切换开销，而  v-show  有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用  v-show  较好；如果在运行时条件很少改变，则使用  v-if  较好。
24. v-for 在遍历对象时，会按  Object.keys()  的结果遍历，但是不能保证它的结果在不同的 JavaScript 引擎下都一致。
25. v-for 其实可以用 of 替代 In，更符合直觉
26. 不要使用对象或数组之类的非基本类型值作为  v-for  的  key。请用字符串或数值类型的值。
27. v-for 和 v-if 当它们处于同一节点，v-for  的优先级比  v-if  更高，这意味着  v-if  将分别重复运行于每个  v-for  循环中
28. 渲染多组件的时候，可以使用 :is 来做，但是我觉得缺陷就是不好跳转。
29. Slot 是插槽，类似于 this.props.children
30. slot 可以设置 name，可以设置默认值，外面用 v-slot 来区分
31. vue 里的 provide/inject 是非响应式的
32. V-once， 只渲染一次，不会被响应式更新，会缓存。
33. 通过 Minxin 复用的情况下，如果是对象，类似于{…mixins, 原本的}如果是方法，就都会调用。
34. 还可以全局混入，如果一个应用或者一个页面有通用功能，可以利用它来全局混入
35. 可以做全局 filter，这样组件内就不用写对应的过滤器了
36. 如果需要给对象添加属性来监听，除了初始化，还可以 this.$set(xxObj, ‘a’, 2)； 这样的形式
37. Nuxt 是一个集成化的方案，可以而且独创了 nuxt generate，可以直接生成静态站点。

### vue composition API

更多的聚合了逻辑，给复用写自定义 composition 带来非常大的提升
[探索composition API](https://segmentfault.com/a/1190000040144197)

1. 使用 setup 来替代之前的除 props 的所有 options， 比如 data、 methods、 computed 等等
2. 使用 ref 和 reactive 来给数据添加响应式处理， 其中 ref 针对值类型，reactive 针对对象类型。需要注意的是，使用 reactive 的时候，不要在返回的时候解构，因为这样会使它失去响应式，这也很容易理解，mobx 也是类似的。
3. 如果解构了，又不希望失去响应四，需要使用 toRefs 方法，但是它也是浅拷贝，所以谨慎使用
4. 同时，有一点不太友好的是，如果已经是 Ref 响应式数据了，除在 template 和 watch 中使用是直接使用，在内部使用的时候需要 .value，这是不符合常理的，为什么不在 getter 的时候处理掉呢？而使用 reactive 的话，浅层是自动解开的
5. 使用 unref 可以肯定得到值而不是 ref。因为很多时候，你需要的就是 ref 和非 ref 联合操作，如果一个.value，一个没有，确实麻烦，所以直接用 unref 方便很多

```js
funcion unref(r) {
    return isRef(r) ? r.value : r;
}
```

6. 如果一个变量已经是 ref 后，再次对他进行 ref 是没关系的，会直接复用，也就是说,ref 的 function 里应该是

```js
function ref(r) {
    return isRef(r) ? r : realRef(r);
}
```
