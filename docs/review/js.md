### ES6

1. `ES6`中暂时性死区`TDZ`是什么？

   暂时性死区就是说如果函数外面写了一个 let a = 1;
   结果里面用的时候，先用了 a，又声明了 let a，会报错，因为它会形成一个封闭作用域。
   而且，用了`let`的话，就代表`typeof`不是绝对安全的了。

2. BABEL 是怎么编译 let 的？

   如果对应变量没有相关性的话，会直接给变成`var`，但是如果有类似于多个相同的，不同地方引用的话，就是改变量名，使内外层的变量名称不一样。

3. 什么是标签模板？模板字符串函数的参数你知道是啥吗？

   标签模板就是在模板字符串前面加个函数，然后通过函数处理这个模板字符串。

   函数里的参数第一个就是非变量的数组合集，后面的参数是...，代表各个参数。

   实际上这个功能意义我觉得不大，因为进了函数处理后，我要先把它拼接起来。那我为什么不直接把整个字符串拿到后在用函数处理一下呢？

4. weakmap 用过吗？ 知道它的使用场景吗？

   `weakmap`就是弱引用，这样对于`gc`会更友好，而且只支持对象，但是它不可迭代，使用场景的话，比如写一个偏向公共的类

   在计算机程序设计中，弱引用与强引用相对，是指不能确保其引用的对象不会被垃圾回收器回收的引用。

   一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，并因此可能在任何时刻被回收。

   比如你用weakmap set的一个key,这个key设置为null后，你就没办法获取到它的值了

   可以利用它实现私有变量。store = new WeakMap(); 比如在`constructor`里，把传进来的值`set`进`this`里，

   ```js
   const privateData = new WeakMap();
   class Person {
       constructor(name, age) {
           privateData.set(this, { name: name, age: age });
       }

       getName() {
           return privateData.get(this).name;
       }

       getAge() {
           return privateData.get(this).age;
       }
   }

   export default Person;
   ```

   然后写个 get 方法，那么这些 props 只能通过 get 获取了。
5. Set WeakSet Map WeakMap

    首先，Set 和 Map 都很相似，只是API略有不同，Set 是通过add加值，Map是通过set加值

    然后就是 Set 的entries的话，是[key, key] 这样的结构，而Map 是[key, val]的形式

    Set更多会操作数组，Map更多的操作对象, Weak这些结构的话，一是弱引用，二正因为弱引用，所以不可迭代。

    ![weak](../img/weak.jpg)

5. class 中把方法写 constructor 里和写外面区别是什么？class 转 es5

    [好链接](https://juejin.cn/post/6844903704873664520)

   写在外面就是它的原型函数

   写在里面就是它的内置函数

   class写静态方法或属性，可以利用static或者是 A.xxx
   ```js
    class Person {
        static sayHello() {
            return 'hello';
        }
        static name = 'kk';
    }
    // 或者是
    Person.sayHello = function() { return 'HELLO'}
    Person.name = 'kk';

    Person.sayHello() // 'hello'

    var kevin = new Person();
    kevin.sayHello(); // TypeError: kevin.sayHello is not a function

    // ES5

    function Person() {}

    Person.sayHello = function() {
        return 'hello';
    };
    Person.name = 'kk';

    Person.sayHello(); // 'hello'

   ```

   类不能直接执行，Person()会报错

6. 私有变量的实现方式

   - 最新的提案可以直接前面写#，这样就成为了私有变量
   - 或者使用`weakmap`，把 this set 进去。
   - 或者使用`Symbol`,这样外面根本无法使用。但是可以通过 `Object.getOwnPropertySymbols`来获取symbol

   ```js
   var dd = Symbol('aaa');
   var obj={}
   obj[dd] = 'haha';
   想用obj.dd是不可能的，只要不暴露。
   ```

   - 或者是原来的闭包的方式

7. 装饰器

   装饰器的话，从函数的角度来看，如果只是作用在`class`组件上的话，其实和`HOC`没多少区别，

   - 作用在`class`组件的话，它的第一个参数`target`指向的就是这个类组件，可以利用这个来写 controller()
   - 作用在类下的方法的话，它的第一个参数是类的原型，第二个参数就是方法名，第三个参数就是一个`description`对象，下面会有枚举，`value`,可写这样的属性.
   - 作用在类下的 get name() {} 这样的话，第三个参数就不会有 value 这样的东西了。第三个参数会有 set get。这里就说到了数据描述符和存储描述符互斥的问题了。
   - 如果直接作用在一个属性上的话，第三个参数是没有 value 或 set get 的，因为那个属性不是在原型本身上的，是在实例化的时候才会有，而装饰器是在编译阶段就执行的，所以也就没有。
     直接作用在类上面，比如

   ```js
   @weapon
   class AAA {

   }
   ```

   这样的形式，`weapon`这个函数里的第一个参数，就是这个类，也就是这个函数

   而只要在类里面，所有的`target`，也就是装饰器的第一个参数，都是这个类的原型。

   可以发现，这些装饰器函数，都在实例化前就全部打印了

   说明啥，说明是在编译阶段就给弄进去了，所以更不可能指向实例了，因为那时候还没有，所以指向的是原型

   第二个参数，目前看来都是`name`，也就是对应的方法名

   第三个参数，就是`description`。也就是对象的描述。

   ```js
   @property
   name = 'jansen';
   @wrapee
   arrowfn= () => {

   }
   ```

   `property`作用在`name`上第三个参数有/`wrapee` 作用在`arrowfn`上第三个参数有

   ```js
   configurable: false
   enumerable: true
   可枚举，如果设置为false,以下3种迭代不会发现这个name
   * for..in循环  ：只遍历对象自身的和继承的可枚举的属性
   * Object.keys方法 ：返回对象自身的所有可枚举的属性的键名
   * JSON.stringify方法：只串行化对象自身的可枚举的属性
   * Object.assign()(ES6）:只拷贝对象自身的可枚举的属性
   使用这个Object.getOwnPropertyNames，可以破解，详情见对比No.36
   initializer: ƒ () 初始化，return初始化的值。
   writable: true 是否可写，设置为false，原地实现readonly
   ```

   ```js
   @setget
   get selfname() {
   }
   ```

   `setget`作用在`get selfname`上，第三个参数有

   ```js
   configurable: true
   enumerable: false
   get: ƒ ()
   set: undefined
   ```

   可以发现，它没有 writable，它只有 set 和 get

   ```js
   @deprecate("我已经废弃了")
   callBad() {
   }
   ```

   `deprecate`作用在`callbad`方法上，第三个参数有

   ```js
   configurable: true
   enumerable: false
   value: ƒ (params)
   writable: true
   ```

   方法有个 value，可以在 value 里说我废弃啦。

   有的有 value,有的有 set get， 其实就是因为一个是数据描述符，一个是存取描述符，它内部帮你排斥好了。
   这两种是不可以混合使用的，使用会报错。
   具体所有类型的我都写在了 decoratorTest 上了，可以去看。

8. HOC 和 renderprops

   HOC 和 renderprops 其实都是属于增强组件

   HOC 就是接受一个组件作为参数，返回一个新的组件。应用的话，就举例子，比如利用 HOC，结合 hook 和 context，自己写一个 connect 函数。

   ```js
   function hoc(params) {
       return function(component) {
           return function(props) {
               return(<Component />)
           }
       }
   }
   ```

   上述的就是接受一个参数，然后返回一个 hoc 函数，hoc 然后接受一个组件，然后返回一个新组件。

   如果好多页面都有一样的代码，比如请求同一个方法，constructor 初始化一个数据的话，可以用 HOC 包一个新组件。这样复用代码。

   HOC 的好处有

   - 支持`ES6`，光这一项就战胜了`mixins`
   - 复用性强，`HOC`是纯函数且返回值仍为组件，在使用时可以多层嵌套，在不同情境下使用特定的`HOC`组合也方便调试。
   - 同样由于`HOC`是纯函数，支持传入多个参数，增强了其适用范围。
     缺点是
   - 当有多个`HOC`一同使用时，无法直接判断子组件的`props`是哪个`HOC`负责传递的。在里面的组件只接受`props`。也不知道这是几级传下来的。
   - 嵌套比较深，阅读起来会有一点障碍

   render Props

   就是把组件当成 props，直接传给子组件，这样就有点像依赖反转，逻辑抽象在外面，然后根据不同的情况，传不同的组件下去。

   ```js
   <ProductData render={({ products }) => <ProductList products={products} />} />
   <ProductData
       render={({ products }) => <ProductTable products={products} />}
   />
   <ProductData render={({ products }) => (
       <h1>
           Number of Products:
           <strong>{products.length}</strong>
       </h1>
   )} />
   ```

   然后再 ProductData 组件的 render 方法里，`render() { this.props.render(this.state.data) }`

   [hoc vs renderprops vs hook](https://jishuin.proginn.com/p/763bfbd36ecc)

9. 箭头函数和普通函数的区别
   - 箭头函数的 this 是透传的
   - 箭头函数不能作为构造函数，所以就不能用 new
   - 箭头函数不能用 arguments，只能用...args
   - 箭头函数没有原型属性
   - 箭头函数不能通过 apply.call.bind 改变 this。

10. 为啥let用window访问不到

    let 在全局中创建的变量存在于一个块级作用域（Script）中,它与 window(Global)平级,
    var 在全局中创建的变量存在于window(Global)中;

11. 为什么 for > forEach > map
    其实这三个循环方法并不完全等价：
    1. for 循环当然是最简单的，因为它没有任何额外的函数调用栈和上下文；
    2. forEach 其次，因为它其实比我们想象得要复杂一些，它的函数签名实际上是 `array.forEach(function(currentValue, index, arr), thisValue)`它不是普通的 for 循环的语法糖，还有诸多参数和上下文需要在执行的时候考虑进来，这里可能拖慢性能；
    3. map 最慢，因为它的返回值是一个等长的全新的数组，数组创建和赋值产生的性能开销很大。

12. 类数组加上push方法，length会增加， 因为push 设计的就是一个通用的[mdn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/push#description)

### JS

1. reduce 方法知道吗？

   用于处理数组，比较好用。可以用来拼接字符串，求和,数组降维以及其他一些需要的数据操作

   `reduce((accumulator, currentValue, currentIndex, array))`

   第一个大参数里的 第一个参数是聚合，第二个是当前的值，第三个是当前的 index，第四个是原始 array。

   第二个参数是初始值，如果没给的话，默认使用第一个值，这也是为什么如果空数组 reduce 的时候，如果不给初始值会报错的原因。

2. array.some, array.every 方法里只写个 Array.isArray 是啥意思

   array.some 里本来就是写一个函数用的，会把每一个参数自动投放进去，Array.isArray 不正好是一个函数吗？

   但是反过来说，如果只写个Array.map(parseInt) 就要小心了，因为我parseInt收两个参数，正好第二个是进制，也就是说，123执行过来的话

   结果应该是1，NaN, NaN， 因为3如果执行2进制，因为2进制里没有3，所以解析不了。

3. 你知道迭代器吗？如何自己写一个简单的迭代器

   迭代器就是一个拥有 next 方法的对象，每次调用会返回一个结果对象，该对象上有两个属性，`value`和`done`
   自己实现一个就是

   ```js
   function createIterator(items) {
       var i = 0;
       return {
           next: function() {
               var done = i >= items.length;
               var value = !done ? items[i++] : undefined;

               return {
                   done: done,
                   value: value
               };
           }
       };
   }
   ```

4. 你知道生成器吗？

   生成器，就是 Generator ，它就是一个状态机。

   ```js
    function* helloWorldGenerator() {
        yield 'hello';
        yield 'world';
        return 'ending';
    }
    var hw = helloWorldGenerator();
   ```

   以上的 hw，可以通过 for of 遍历，但是不会看到 ending，只能遍历 yield 出来的，如果不用，就是 hw.next()，

   - next 方法里其实可以带参数，该参数就会被当作上一个 yield 表达式的返回值。这样可以无限执行。

   ```js
   function* f() {
    for(var i = 0; true; i++) {
        var reset = yield i;
        if(reset) { i = -1; }
    }
    }

    var g = f();

    g.next() // { value: 0, done: false }
    g.next() // { value: 1, done: false }
    g.next(true) // { value: 0, done: false }

   ```

   - `yeild *`是一个比较有意思的语句，它可以用来在生成器里，执行另外一个生成器函数。

   ```js
    function* foo() {
        yield 'a';
        yield 'b';
    }
    function * bar() {
        yield 'x';
        yield* foo();
    }
    for of bar(), 会执行,x,a,b
   ```

   - 实际上，任何数据结构只要有 Iterator 接口，就可以被 (yield*) 遍历, 当然，前提是外层有 function* ，不然你也用不了 yield 啊
   - 扩展运算符...默认调用 Iterator 接口
   - 如果是作为对象属性的话，直接方法前跟 \* 即可

   ```js
    let obj = {
        * myGeneratorMethod() {
            ···
        }
    };
   ```

5. for of, for in 的区别

   for of 就是可以遍历拥有 iterator 属性的对象或数组,
   他们的原型上都会有一个 Symbol.iterator 的属性,
   typeof 它是一个函数。

   所以如果自己想让对象也能 for of 的话，可以自己写一个

   ```js
   obj[Symbol.iterator] = function* () {
       for(let [key, val] of Object.entires(this)) {
           yield {key, val};
       }
   }
   // 使用自己的方法
   obj[Symbol.iterator] = function() {
       var arr = Object.entries(obj).map((item)=> ({key: item[0], val: item[1]}))
       return createIterator(arr);
   };
   ```

   对于一个数组来说，object.keys 和 object.values 是一样的。

   object.entires 是一个 key,val 数组。

   for in 主要用于遍历对象的属性，当然也可以用来遍历数组元素

6. fetch 怎么用，如何封装一下它

   - `fetch`算是新一点的`api`，用法简单点
   - 通过`promise`链的方式来输出数据,
   - 封装的话就是把`header`封装下，然后把结果封装下就可以了,
   - 要提的就是`header`下的`body`部分，`post`的话需要自己拼装的,
   - 然后`credentials`需要写`include`，代表可以带`cookie`参数,
   - mode:"cors",是走 cors 模式跨域
   - 不过`fetch`不支持`node`，所有如果是有`ssr`的话，可以用`axios`

7. Object.freeze（浅冻结）Object.seal 区别，如何深冻结一个对象？

   - Object.freeze 是把对象的属性冻结，不能修改不能添加不能删除，但是是浅冻结
   - Object.seal 是封闭一个对象。是可以修改属性的值的（前提是本来就可写）。但是不能删除不能新增。

   所以`seal`比`freeze`少一个限制修改属性值。所以更像是封闭对象结构。

   ```js
   // 深冻结
   function deepFreeze(object) {
       const keys = Reflect.ownKeys(object);
       for(let k of keys) {
           typeof object[k] === 'object' && deepFreeze(object[k]);
       }
       return Object.freeze(object)
   }
   ```

8. Object.defineProperty,Proxy 对象,Reflect 对象

   ```js
   Object.defineProperty(obj, 'prop1', {
       value: 1,
       // 数据是否可写,默认false,如果上了false,非严格模式下数据不会有任何变化。
       // 但是严格模式下会报错。prop1 is readonly
       writable: true,

       set:function() {}
       get:function() {}

       enumerable: 是否是可枚举的，默认是false，通过字面量创建的默认是true。

       configurable: 是否可以配置

    })

   ```

   set，get 不能和 value,writable 同时出现。因为前者是存取描述符，后者是数据描述符，强行会报错。

   除了`value`, `writable`以外其他属性是否可以配置。`configurable`当且仅当 `configurable`为 `true`时，该属性才能够被改变，也能够被删除（`delete`），默认为 `false`

   此外，`descriptor`这里所有属性都是非必须的，但是，只要写了`defineProperty`，至少要给第三个参数一个空对象。

   应用实例，`Vue`之前就是靠它来实现数据监控的。

   如果某个属性你不想让人用了，可以给它的 get 下添加个 console.warn。

   defineProperty 不能监控数组的变化，而且只能监听对象的属性。如果一个对象很多属性，需要遍历。

   像Vue里，他监控数组的方式是复写数组的方法， `push() pop() shift() unshift() splice() sort() reverse()`

   ```js
    const aryMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    const arrayAugmentations = [];
    aryMethods.forEach((method)=> {
        // 这里是原生Array的原型方法
        let original = Array.prototype[method];
        // 将push, pop等封装好的方法定义在对象arrayAugmentations的属性上
        // 注意：是属性而非原型属性
        arrayAugmentations[method] = function () {
            console.log('我被改变啦!');
            // 调用对应的原生方法并返回结果
            return original.apply(this, arguments);
        };
    });
   ```

   proxy 相当于一个中间层，proxy 是直接监听对象的，而且可以操作的 handler 很多，比如 set,has,get,apply,call 等等。它比 defineProperty 强大很多。<b>至于属性也是对象的情况下，两者都还是需要递归监听的。</b>

   举个例子

   ```js

   var obj = {name: 1, sex: 'male', in: {k: 1, d : 2}}

   var cc = new Proxy(obj, {
    set(target,key,val, receiver) {
        const pre = '强制改成';
        return Reflect.set(target, key, pre + val, receiver);
    },
    get(target,key,receiver) {
        console.log('我听到我被动了');
        // 可以在这里判断get出来的是不是对象，然后递归proxy？
        return Reflect.get(target, key, receiver)
    }
   });
   ```

   在上面这个代码里，访问cc.name，会触发log， 访问cc.in.k，也会触发

   修改cc.name会被加上一个 ‘强制改成’，但是修改cc.in.k，不会，因为修改cc.in.k，cc.in是一个对象引用类型，所以不会变。而get之所以会触发，是因为访问 `cc.in.k`，也就等于访问到了`cc.in`了啊，所以才会触发的。

   里面好多方法第三个参数其实就是一个新的 OBJ 指向。

   如果一个属性不可配置（configurable）且不可写（writable），则 Proxy 不能修改该属性，否则通过 Proxy 对象访问该属性会报错。

   可以利用它，写一个年龄自增

   ```js
    var obj = {
        name: 'aaa',
        age: 1
    };
    var ss = new Proxy(obj, {
        get(target, key, recevier) {
            if (key === 'age') {
                let vv = target[key];
                Reflect.set(target, key, vv + 1, recevier);
                return vv + 1;
            }
            return Reflect.get(target, key, recevier);
        }
    });
   ```

   Reflect 和 Proxy 是一对。正常取值，甚至可以替代关键字符，比如 in 或者 delete 这样的。

   它可以分为一部分是是原来存在 Object 上的方法，将它转义到了 Reflect 上，并作了小改动，让方法更加合理。

   另一部分是将原来操作符的功能，变成函数行为。

   ```js

   // 老写法 'assign' in Object // true
   // 新写法 Reflect.has(Object, 'assign') // true
   // 老写法 Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1
   // 新写法 Reflect.apply(Math.floor, undefined, [1.75]) // 1
   // 旧写法 delete myObj.foo;
   // 新写法 Reflect.deleteProperty(myObj, 'foo');
   // new 的写法 const instance = new Greeting('张三');
   // Reflect.construct 的写法 const instance = Reflect.construct(Greeting, ['张三']);
   var myObject = {
        foo: 1,
        bar: 2,
        get baz() {
            return this.foo + this.bar;
        },
   };
   var myReceiverObject = {
        foo: 4,
        bar: 4,
   };
   Reflect.get(myObject, 'baz', myReceiverObject) // 8

   ```

9. Number.isNaN 和 isNaN 的区别

   - isNaN 意思是这个是不是不是一个数字，比如它是 isNaN('abc') 就是 true。
   - Number.isNaN 只有 Number.isNaN(NaN)才是 true
   - Number.isNaN 是 es6 的，如果自己写的话，就是利用 typeof NaN 是 number 来写

10. String.raw

    如果一串字符串，里面有\n 之类的，可能会被转译，如果不想让它被转译，想直出，
    用`String.raw`abc \n ss``,会把换行符号也返回出来，就是一个未加工的值，实际应用感觉没有。

11. 描述一下事件传播

    当事件发生在`DOM`元素上时，该事件并不完全发生在那个元素上。

    从`window`开始，一路向下传递到目标元素，这叫捕获阶段

    然后从目标元素传递回`window`，这叫冒泡阶段。

    `addeventlistener`就是监听目标用的，然后第三个参数是`boolean`类型，默认`false`是冒泡阶段，`true`就是捕获阶段。

    事件传播到了目标后，触发的顺序按照 声明的顺序来，也就是说，完全可能是先冒泡后捕获。

    阻止冒泡使用的是`e.stoppropagation`,阻止捕获用的是`e.stopImmediatePropagation`

12. JavaScript 中的虚值是什么

    `const falsyValues = ['', 0, null, undefined, NaN, false];`
    这里面的都是虚值，虚值就是在转化成 boolean 时为 false 的值。

13. Object.create 创建出来的对象和正常的区别是什么？如何创建一个没有原型的对象？

    通过 Object.create 创建出来的对象的原型指向传入的对象，也就是说

    ```js
    function P() {this.name = 'kk'}
    P.prototype.sex = 'm'
    var bb = Object.create(P)
    bb.__proto__ == P // true
    var cc = Object.create(P.prototype);
    cc.__proto__ == P.prototype // true
    var a = new P();
    ```

    根据这个特性，可以看出来，Object.create 和 new 还是有区别的，new 多了一个 call 的过程,a 会有 name 属性，而 cc 没有。
    但是，直接创建一个新的空对象的话，那就一样了。以下三下是一样的。

    ```js
    var obj = {};
    var obj = new Object();
    var obj = Object.create(Object.prototype);
    ```

    很多时候，就是只想要一个干净的对象，不需要原型，用于节省性能的话，直接 Object.create(null) 就可以了；

    Object.create 的第二个参数和 defineproperty 第二个一样。也就是说，上述想给 cc 来个 name,咋办

    ```js
    Object.create(P.prototype, {
        name: {
            value: 'kk',
            writable: true
        }
    });
    ```

    那么，写一个 object.create 的简单 polyfill 版本(不支持第二个属性)

    ```js
    Object.create2 = function(proto) {
        function F() {};
        F.prototype = proto;
        return new F();
    }
    ```

14. new 关键字有什么用？它到底做了啥？

    new 和构造函数创造一个对象。

    ```js
    var obj = {};
    obj.__proto__ = Obejct.prototype;
    Object.call(obj);
    ```

    其实从这段代码就可以看出，虽然最后创建出来的对象是一致的，但是多赋值了一次，obj.\__proto\__ = Object.prototype,因为字面量创建的本来就是个对象了。所以，还是字面量方式更好

15. 手写一个 promise

    - 第一步，先写这里的回调函数 三个状态，then 里的函数可以不传。
    - 第二步，回调里是可以写异步的，也就是说，到了 then 里可能还在 pending
    - 第三步，p 是一个链式调用的，所以要包装一个 promise2 return 出来 并且里面的执行需要 try catch，抓错。
    - 第四步，防止 then 里返回 promise 本身，以及返回的还是一个 promise，需要加一个判断函数。如果是本身，reject，如果是 promise，继续 then，最后 resolve。
    - 第五步，加 catch 方法，其实就是调用 this.then(null,rejectCallBack);
    - 第六步，原型上加一个 Resolve 和 Reject 方法，就是调用自己，new Promise()执行对应的方法
    - 第七步，all 方法，all 方法返回的所有 promise 结果的合集，然后做一个下标，挨个执行 promise，然后 index++,最后 index = promise.length 的时候，resolve(result);
    - 第八步，race 方法，这个直接挨个执行 then，resolve 即可。这也说明 race 其他的还是会跑完的。只不过不管结果而已。

    [promise](https://zhenglin.vip/js/promise.js)

16. 事件委托的原理

    因为事件传播正常是先捕获后冒泡，那么捕获的时候，一定会经过目标元素的上级，这就是事件委托的原理。

17. 原型、作用域、原型链、作用域链

    - js 本质上一切皆对象，每个对象都要有原型，这也是为什么有继承关系。
    - 原型链的话就是比如某个 a 是继承于 A，那么 a 怎么能找到 A 就是通过原型链，instanceof 实际上就是个原型链查找。
    - 作用域就是遍历或者函数能作用的范围，作用域链就是某一个变量在某个地方使用到了，在编译的过程中，会保留一条它的作用域链，让它能够通过该作用域链找到对应的自己那个属性。
    - 函数有一个内部属性 [[scope]] ,当函数创建的时候，就会保存所有的父变量对象到其中。
    - [[scope]] 可以理解为所有父级变量对象的层级链

18. instanceof 原理是啥？

    instanceof 其实就是利用原型链去查找，找到了就返回 true
    自己写一个就是

    ```js
    while(left.__proto__) {
        if(left.__proto__ === right.prototype) {
            return true;
        }
        left = left.__proto__
    }
    return false;
    ```

    但是instanceof 并不是安全的，因为可以复写
    ```js
    class PrimitiveString {
        static [Symbol.hasInstance](x) {
            return typeof x === 'string'
        }
    }
    console.log('hello world' instanceof PrimitiveString) // true
    ```

19. null,undefined,未声明的变量的区别

    - 未声明的变量就是不用 let ,var, const 关键字的比如直接写 a = 2;这样的，如果是在严格模式下，会报错
    - undefined 就是这个变量已经声明，但是没有赋值，所以会是 undefined.
    - 函数作用域下 undefined 可以被重写，这也是为什么最好用 void 0 替代的原因。
    - null 的话只能显式的被赋值，标识空值。
    - null == undefined；没有隐式转换。

20. foreach 和 map 的区别

    foreach 是遍历数组中的元素，没有返回值，通常需要修改原始数组的时候可以用 foreach, 如果直接`item = 2`， 这样foreach也不会改变原数组的，是没有意义的，只有`item.a = 2`,这样才是有意义的，虽然map也会改变，但是约定

    map 的话就是生成一个新的数组。如果不想修改原数组可以用 map

    上述两个方法都会跳过稀松数组。

    foreach不能打断，如果要强行打断，就用try catch，想要打断的循环可以用for, for of, every返回false, some 返回true。

    foreach 不能用await，无法保证顺序，而for of就可以，因为用的是迭代器。

21. 宿主对象和原生对象的区别

    - 原生对象是由 `ECMAScript`规范定义的 `JavaScript`内置对象，比如`String`、`Math`、`RegExp`、`Object`、`Function`等等。
    - 宿主对象是由运行时环境（浏览器或 `Node`）提供，比如`window`、`XMLHTTPRequest`等等。比如`Node`的`process`,`setImmediate`。

22. call,apply,bind 区别

    - call 第二个参数是一个一个的
    - apply 第二个参数是数组
    - bind 是和 call 一样，但是生成了一个新的函数。
    - 实现 bind 就更简单了，context 不用动，传递下 this 函数，然后 return 个 function，参数和之前的组合一下，调用 apply 就可以了。
    - call 比 apply快，因为apply内部还要判断参数是不是数组，还需要获取数组length等等，而call就没这些事

23. 事件循环 event loop

    我们知道`JavaScript`的一大特点就是单线程，而这个线程中拥有唯一的一个事件循环。

    在`promise`之前，`js`其实是没有异步的，`settimeout`是宿主环境的。

    `JavaScript`代码的执行过程中，除了依靠函数调用栈来搞定函数的执行顺序外，还依靠任务队列(task queue)来搞定另外一些代码的执行。

    事件循环分为宏任务和微任务，其中宏任务就是如同 `settimeout,setInterval，requestAnimationFrame, MessageChannel`

    而微任务就是 `promise.then,MutationObserver`

    在 Node 中，又有些不一样，就单从 API 层面上来理解，Node 新增了两个方法可以用来使用：微任务的 process.nextTick 以及宏任务的 setImmediate。

    setTimeout 和 setImmediate 的区别的话就是 settimeout 是时间延迟，setImmediate 是循环延迟。

    timers 阶段会执行 setTimeout 和 setInterval 回调，并且是由 poll 阶段控制的。同样，在 Node 中定时器指定的时间也不是准确时间，只能是尽快执行。
    ```js
    setTimeout(() => {
       console.log('setTimeout')
    }, 0)
    setImmediate(() => {
       console.log('setImmediate')
    })
    ```
    这段代码的执行顺序是不一定的
    - 首先 setTimeout(fn, 0) === setTimeout(fn, 1)，这是由源码决定的
    - 进入事件循环也是需要成本的，如果在准备时候花费了大于 1ms 的时间，那么在 timer 阶段就会直接执行 setTimeout 回调
    - 那么如果准备时间花费小于 1ms，那么就是 setImmediate 回调先执行了

    但是如果写在IO里面的话，就是 setImmediate 先执行了，因为这个就等于在 poll 阶段，队列为空，立马去执行后者

    两者最主要的区别在于浏览器中的微任务是在每个相应的宏任务中执行的

    而 nodejs 中的微任务是在不同阶段之间执行的。如果是老的Node版本，就是先执行完宏任务，在一次性清空微任务，新版本就是在每个阶段里，清空微任务

    关于 process.nextTick 的一点说明
    process.nextTick 是一个独立于 eventLoop 的任务队列。
    在每一个 eventLoop 阶段完成后会去检查这个队列，如果里面有nextTick，会让这部分任务优先于其他微任务执行。

    用两个例子论证上面的说法
    ```js
    setTimeout(()={
        console.log("time1");
        process.nextTick(()=>{
            console.log("nextTick2");
        });
    });
    console.log("start")
    process.nextTick(()=>{
        console.log("nextTick1");
        setTimeout(()={
            console.log("time2");
        });
    });
    // node10以上 start nexttick1 time1 ntick2 time2
    // node10以下 start nexttick1 time1 time2 tick2

    setTimeout(()={
        console.log("time1");
        Promise.resolve.then(()=>{
            console.log("pthen1");
        });
    });

    setTimeout(()={
        console.log("time2");
        Promise.resolve.then(()=>{
            console.log("pthen2");
        });
    });
    // node9 time1 time2 pthen1 pthen2
    // node10 time1 pthen1 time2 pthen2
    ```
    以前就是宏任务执行完，清空微任务，现在就是每个小宏任务里，执行完对应的微任务。

    关于await
    ```js
    await 要分开看
    // await 前面的代码
    await bar();
    // await 后面的代码
    // 其中 await 前面的代码 是同步的，调用此函数时会直接执行；
    // 而 await bar(); 这句可以被转换成 Promise.resolve(bar())；
    ```
    await 后面的代码 则会被放到 Promise 的 then() 方法里。

    还有，比如微任务相当于是添加到宏任务里来的。如果一个 promise 里不写宏任务的话，那外面的 settimeout 可以等死。

    ```js
    setTimeout(()=>{
        console.log('1');
    },0);
    setTimeout(()=>{
        console.log('2');
    },2500);
    var now = Date.now();
    var d = new Promise((resolve, reject) => {
        while(Date.now() - now < 2000) {
        }
        console.log('3');
        resolve('4');
    });
    d.then((res)=>{
        console.log(res);
        var now = Date.now();
        return new Promise((resolve, reject) => {
            while(Date.now() - now < 2000) {
            }
            console.log('5');
            resolve('6');
        })
    }).then((res)=> console.log(res))
    ```

    这段的话，settimeout 要在 4s 后才能执行，加多少个 then 都得等 then，因为他们属于同一个宏任务下没执行完的微任务。

24. 如何实现一个深拷贝（[Object xxxx]）[loadsh](https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L11087)

    基本完整版本参见 [deepCopy.js](https://zhenglin.vip/js/deepcopy.js)

    如果不需要function的话，可以异步使用一个 MessageChannel

    ```js
        function structuralClone(obj) {
            return new Promise(resolve => {
                const {port1, port2} = new MessageChannel();
                port2.onmessage = ev => resolve(ev.data);
                port1.postMessage(obj);
            });
        }
    ```

25. typeof null 为啥是 object？

    原理是这样的，不同的对象在底层都表示为二进制，在`Javascript`中二进制前三位用来表示 `TYPE_TAG`

    而正巧 Object 类型的前三位就是 0

    null 在设计的时候是一个空指针，它的二进制表示全为 0，自然前三位也是 0，所以执行 typeof 时会返回"object"。

26. 什么是闭包，闭包经典问题解法有哪几种？

    闭包就是函数内可以访问函数外的变量，就属于闭包。但是我们常说的，是属于调用栈出栈了，依然能够中找到那个变量。

    闭包本质上就是作用域链的问题，闭包就是当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。

    比如通常就会利用闭包做一个封闭作用域，创建内部变量，使得这些变量不能被外部随意修改，同时又可以通过指定的函数接口来操作。

    ```js
    const Counter = function(){
        let count = 0;
        return {
            increment: ()=>{
                return count ++;
            }
        }
    }()
    Counter.increment();
    ```

    - 用 let 封闭作用域
    - 用 settimeout 第三个参数就是传给 settimeout 里面的函数的入参。

27. 实现继承的几种方式

    - 原型链继承
      `sub.prototype = new Parent();`
      缺点 1 就是 Parent 的原型大家共享了，一荣俱荣。2 在创建 Child 的实例时，不能向 Parent 传参

    - 寄生组合继承

    ```js
    function Sub() {
      Super.apply(this, arguments);
    }
    Sub.prototype = Object.create(Super.prototype, {
        constructor: {
            value: Sub,
            enumerable: false,
            writable: true,
            configurable: true
        }
    })
    ```

    - 类继承
      `xx extends`

    普通继承和类继承是有区别的，es5 是借助构造函数实现，实质上是先创造子类的实例对象 this，然后再将父类的方法添加到这个 this 上去。

    而 es6 的继承机制完全不同，实质上是先创造父类的实例对象 this（所以必须先调用 super 方法，）然后再用子类的构造函数修改 this。

    es6 在继承的语法上不仅继承了类的原型对象，还继承了类的静态属性和静态方法。

    通过代码来解释
    ```js
    function MyArray() {
        Array.call(this);
    }

    MyArray.prototype = Object.create(Array.prototype, {
    constructor: {
        value: MyArray,
        writable: true,
        configurable: true
    }
    });

    var colors = new MyArray();
    colors[0] = "red";
    colors.length; // 0

    class MyArray extends Array {
        constructor() {
            super();
        }
    }

    var arr = new MyArray();
    arr[0] = 12;
    arr.length; // 1
    ```
    在不是继承原生构造函数的情况下，A.call(this) 与 super() 在功能上是没有区别的

    但是如果是原生对象，就不行了，是拿不到内部属性的

28. 手写 call, apply, bind 出来

    call 和 apply，就是传一个上下文进去，没有就赋值 window

    然后 call 和 apply 的执行函数，赋值给 context，相当于传递上下文

    找一个中间值,Symbol('fn')就可以了。

29. 常见的正则标识符

    \s 空格，\w 包括下划线在内的单个字符，[A-Za-z0-9_]， \b 单次边界, \i 忽略大小写

30. 千位分割符正则

    `reg = /\d(?=(\d{3})+$)/g`

    `str.replace(reg, '$&,')`

    拆解来说，第一个，必须要有一个\d，用来占一个数字，防止出现 ,233,333 这样的情况

    关于 `?=` 的意思，就是用了这个，就是正向预查， `\d(?=)` 就是指前面有一个数字，后面满足啥啥条件的

    这样的情况下，字符串会从前往后匹配，并不是从后往前匹配，不过关系其实不大。

    至于结束的时候加个\$，可以用一组例子来解释。

    ```js
        var str = '12345678';
        var reg = /\d(?=(\d{3})+8)/g;
        str.replace(reg, '$&,');
    ```

    如果是这个样子，就是前面有数字，后面有 3 个数字+8 进行匹配。

    假设是从后往前匹配

    第一个，到了 4 的时候，是不是就是 4 前面有数字，后面是 567+一个 8 呢？

    所以 4 是满足条件的，4 就是第一个遇到的条件值，replace 就是 4 后加,

    然后继续，到了 1 的时候，后面是 234+567+8，是不是等于\d{3} \* 2 + 8 呢，所以 1 后加, 通过。

    假设是从前往后匹配，一样的。就是先找到 1，后找到 4 而已。只是从后往前好理解一点而已

    这里理解最容易出问题的就是(\d{3})+ 这里，会让人觉得每 3 位匹配一次一样，实际上不是的，是按照上述说的来匹配的。

    所以答案是`1,234,5678`

    那么，后面加结束符号是啥意思呢？

    ```js
        var str = '12345678';
        var reg = /\d(?=(\d{3})+8$)/g;
        str.replace(reg, '$&,');
    ```

    如果你不加的话，123456789，依然会匹配成`1,234,56789`,如果加了结束符号，就是必须以 8 为结尾了。

    那我们看回本题

    ```js
        var str = '12345678';
        var reg = /\d(?=(\d{3})+)/g;
        str.replace(reg, '$&,');
    ```

    如果我没有加这个\$符号的话，我们的答案会是 1,2,3,4,5,678

    来看看为啥，从前往后查找对不对

    先看 1，1 后面是 2345678，有两组 d3+8，你说满足条件吗？它后面有 d3 啊，那就是满足，所以 1 后面加逗号

    后续的一样的，到了 5 的时候后面有一组 d3，也加逗号，到了 6 的时候，6 后面没有 d3，所以不加了

    那么如果我加了\$结束符号

    ```js
        var str = '12345678';
        var reg = /\d(?=(\d{3})+$)/g;
        str.replace(reg, '$&,');
    ```

    就是，前面有一个数字，后面有若干个 d3，并且直接就是以这个 d3 结尾的。

    所以 1 后面是两组 d3+8,就满足不了，也就必须是 d3 的倍数。

    所以答案是 12,345,678。 也就是本题的答案

    至于替换的，就是满足的 replace 的值, 就是$&子表达式们，$1 是第一个匹配上的，$2是第二个匹配到的，$&是子们

31. observer 的几个 API

    - Intersection Observer，可以用它来做懒加载，比使用 getBoundingClientRect()的好处是它的性能会更好。

    两个参数，一个 callback,一个 options，opts 里可以设置根元素和边界大小。

    callback 里用来检测变化进行对应的改变

    - MutationObserver 利用它可以检测 DOM 节点元素，比如禁止删除水印功能。

    ```js
    mutationObserver.observe(content, {
        attributes: true, // Boolean - 观察目标属性的改变
        characterData: true, // Boolean - 目标节点或子节点树中节点所包含的字符数据的变化
        childList: true, // Boolean - 目标节点（如果subtree为true，则包含子孙节点）添加或删除新的子节点。默认值为false。
        subtree: true, // Boolean - 目标以及目标的后代改变都会观察，就是如果这个值为true,其他属性为true后就会都包含子节点。
        attributeOldValue: true, // Boolean - 表示需要记录改变前的目标属性值
        characterDataOldValue: true, // Boolean - 设置了characterDataOldValue可以省略characterData设置
        // attributeFilter: ['src', 'class'] // Array - 观察指定属性
    });
    ```

    - PerformanceObserver，监控浏览器性能的，我也没用的上。

32. requestIdleCallback 和 requestAnimationFrame 的区别

    浏览器一帧里 16ms 要完成的任务

    老：

    1. 处理用户的交互
    2. JS 解析执行
    3. 帧开始。窗口尺寸变更，页面滚去等的处理
    4. rAF(requestAnimationFrame)
    5. 布局
    6. 绘制

    新：

    1. 当 Eventloop 执行完 Microtasks 后，会判断 document 是否需要更新，因为浏览器是 60Hz 的刷新率，每 16.6ms 才会更新一次。
    2. 然后判断是否有 resize 或者 scroll 事件，有的话会去触发事件，所以 resize 和 scroll 事件也是至少 16ms 才会触发一次，并且自带节流功能。
    3. 判断是否触发了 media query
    4. 更新动画并且发送事件
    5. 判断是否有全屏操作事件
    6. 执行 requestAnimationFrame 回调
    7. 执行 IntersectionObserver 回调，该方法用于判断元素是否可见，可以用于懒加载上，但是兼容性不好
    8. 更新界面

    以上就是一帧中可能会做的事情。如果在一帧中有空闲时间，就会去执行 requestIdleCallback 回调。

    `requestAnimationFrame`的回调会在每一帧确定执行，属于高优先级任务，而`requestIdleCallback`的回调则不一定，属于低优先级任务。

    假如在一帧 1000/60~= 16ms，这一帧没用完，还有空闲的话，就可以 requestIdleCallback 来执行想要执行的任务。

    推荐放在 requestIdleCallback 里面的应该是微任务（microTask）并且可预测时间的任务。它的第二个参数就是执行的最晚时机。

    缺点的话是 requestIdleCallback 的 FPS 只有 20, 一秒只有 20 次调用。

33. 为什么 js 是单线程的？

    因为 JS 是用来处理页面中的用户交互以及操作 DOM，css 的。
    如果它是多线程的话，可能会造成 UI 冲突。
    上操作锁的话，会增大复杂性，所以设计之初就是选择了单线程。

34. 为什么 js 会阻塞页面加载

    因为 JS 可以操作页面，如果不阻塞的话，可能会导致数据不一致。

35. for in, Object.keys,Object.getOwnPropertyNames,Reflect.ownKeys 区别

    - for in 遍历会把原型上的属性遍历出来。
    - Object.keys 不会把原型上的属性遍历出来。
    - Object.getOwnProPropertyNames 不会把原型上的属性遍历出来，但是即使自己下的不可枚举属性，也是可以遍历出来的。
    - Reflect.ownKeys 不会把原型上的属性遍历出来，不可枚举属性，但是 Symbol 是可以遍历出来，
      相当于 Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))

36. 为何 try 里面放 return，finally 还会执行，理解其内部机制

    try catch finally 是一个特殊的语法块。

    finally 里面的东西会在 try 的 return 里具体的 return 之前运行，什么叫具体的 return 呢？

    就是如果 try 里 return 的是一个函数执行，那就会先执行这个函数，直到真正看到 return 一个值的时候，执行 finally 并先 return

    ```js
    function justLog(){
        console.log('来自justLog的打印');
        return '来自justLog的return'
    }
    function fn() {
        try {
            console.log('try块内log');
            return justLog();
        } catch (error) {
            console.log('catch块内log');
            return 'catch中的return语句';
        } finally {
            console.log('finally块内log====');
            return 'finaly中的return';
        }
        return '一般情况下的return';
    }
    console.log(fn()); 结果就是trylog,justlog,finallylog,finally return。
    ```

    利用这个，可以在一个函数中间插入点东西执行。比如上面的 justLog 中间想在 return 前处理个数据，就可以利用 try catch finally 来搞。

37. base64 的编码原理

    - `btoa('abc') = 'YWJj'` base64 编码 byte to ascii
    - `atob('YWJj') = 'abc'` base64 解码 ascii to byte
    - 如果需要支持中文的话，需要先 encodeURLComponent 一下。

    Base64 的编码方法要求把每三个 8bit 的字节转换成四个 6bit 的字节，然后把 6Bit 再添两位高位 0,组成四个 8Bit 的字节。所以会变长很多。

    base64 由字母 a-z、A-Z、0-9 以及+和/, 再加上作为垫字的=, 一共 65 字符组成一个基本字符集, 其他所有字符都可以根据一定规则, 转换成该字符集中的字符。

    如果要编码的二进制数据不是 3 的倍数，最后剩下一个或者两个字节 Base64 会在末尾补零，再在编码的末尾加上一个或者两个‘=’。

38. 几种进制的相互转换计算方法，在 JavaScript 中如何表示和转换

    - 十进制转其他进制
      xx.toString(radix); radix 2 ~ 36 的整数，默认是 10
    - 其他进制的整数转 10 进制。
      parseInt('8 进制的数', 8);
      如果有小数的话，不处理。
      所以如果小数也要的话，自己写一个函数，把小数的部分拆出来

    ```js
    arr.reduce((all, item)=> {
        return all + Number(item) * Math.pow(2, (-(idx + 1));
    }, 0)
    ```

    这样小数就会转换回 10 进制。

39. 0.1+0.2 为什么不等于 0.3

    因为 JavaScript 使用的是 64 位双精度浮点数编码，所以它的符号位占 **1**位(0 代表正，1 代表负),指数位占 **11** 位，尾数位占 **52** 位。
    然后 0.1+0.2 在转换成二进制的时候，会发生精度丢失，因为只取 64 位固定长度。

40. 12.toString()为什么会报错

    因为 js 在编译的时候，12.会解析成一个数字，它会认为 toString 就是后面的小数，解决办法就是 12..toString()就可以了。

41. 写代码要不要加分号，不加分号有哪些情况会出问题？（IIFE 为啥前面加分号）

    有些语句会自动加分号，有些不会。
    主要是在词法分析阶段会出毛病。
    真正会导致上下文解析出问题的 token 有 5 个。

    - 括号（认为是参数要执行）
    - 方括号（认为是数组或者是对象属性）
    - 正则开头的斜杠（和前面的字符串组起来了）
    - 加号，减号（这更不用说了）

42. while 和 do while 的区别是什么？

    使用 while 的话必须满足条件才能进行，而 do while 的话是不管条件满足与否，都会先执行一次 do

43. 位运算有哪些呢？

    - 这里插一个\*\*， 就是乘方，不过它是右结合的， 4\*\*3\*\*2 会先求 3\*\*2
    - 9，二进制是 1001。 8，二进制是 1000
    - & 按位与 9&8 = 8
    - | 按位或 9|8 = 9
    - ^ 异或，异或的意思就是位上是一样的就是 0，不一样的就是 1。 9 ^ 8 = 0001 = 1
      可以利用异或来交换两个数。a = a ^ b; b = a ^ b; a = a ^ b;
    - ~ 按位非， 0 变 1，1 变 0。 这个因为符号位的问题，所以不好写，~9 = -10
    - << 左移一位 将 a 的二进制形式向左移 b (< 32) 比特位，右边用 0 填充。 9<<1 = 10010 = 18
    - (>>>) 无符号右移一位 将 a 的二进制表示向右移 b (< 32) 位，丢弃被移出的位，并使用 0 在左侧填充。
    - (>>) 有符号右移一位 将 a 的二进制表示向右移 b (< 32) 位，丢弃被移出的位。
      这两个不太好用。对于正数而言一样。对于负数而言不好算。

44. 利用按位&来检查一个数字是否是奇偶数

    n&1 其实就是二进制，1 的二进制最后一位是 1，那么偶数的最后一位是 0，所以 4&1 一定是 0，5&1 是 1

45. 零宽空格

    零宽空格就是看不到任何迹象，实际上却占用一个位子

    ```js
    var str = '\uFEFFabc';
    str = abc;
    str.length = 4;
    \uFEFF。可以给代码加个料，别人复制了后肯定用不了。
    ```

46. JavaScript 可以存储的最大数字、最大安全数字，JavaScript 处理大数字的方法、避免精度丢失的方法

    - Number.MAX_VALUE 可存储的最大数字 == (Math.pow(2,53) - 1) \* Math.pow(2, 971) 。 971 = 1023 - 52； 这个1023就说2的11次方-1
    - Number.MAX_SAFE_INTEGER 最大安全值 == Math.pow(2,53) - 1;
    - 超过安全最大值精度就开始不准了。
    - 解决办法就是用 bigint 或者是变成字符串，小数字的话可以转换成整数。通常和钱相关，可以先乘 100

47. 什么是 bigInt?

    BigInt 是一种新的数据类型，用于当整数值大于 Number 数据类型支持的范围时。这种数据类型允许我们安全地对大整数执行算术操作。

    在 JS 中，所有的数字都以双精度 64 位浮点格式表示，那这会带来什么问题呢？

    这导致 JS 中的 Number 无法精确表示非常大的整数，会出现丢失精度的问题。

    给大数字后面加个 n 就可以了，兼容性还不好。

48. 理解词法作用域和动态作用域

    作用域是指程序源代码中定义变量的区域。

    作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。

    JavaScript 采用词法作用域(lexical scoping)，也就是静态作用域。

    函数的作用域在函数定义的时候就决定了。JavaScript 采用的是词法作用域。

    动态作用域就是函数的作用域是在函数调用的时候才决定的。

49. this 的原理以及几种不同使用场景的取值

    - 显示绑定
      call、apply、bind 可以显示的修改函数的 this 指向
    - 隐士绑定
    - 全局上下文
      this 指向 window,严格模式下为 undefined
    - 直接调用函数
      this 指向 window,严格模式下为 undefined
    - 作为对象的方法调用
      obj.foo()。 this 指向对象 obj
    - DOM 事件的绑定
      onclick 和 addEventerListener 中 this 默认指向绑定事件的元素。
    - new 构造函数绑定
    - 构造函数中的 this 指向实例对象
    - 箭头函数
      箭头函数没有 this, 因此也不能绑定。
      在箭头函数里的 this 会指向 外层的非箭头函数的 this。

50. Object.is 和===的区别

    Object 在严格等于的基础上修复了一些特殊情况下的失误，具体来说就是+0 和-0 它修正为 false，NaN 和 NaN 修正为 true

51. addEventListener 第三个参数是啥?

    false 是冒泡，true 是捕获
    如果是个对象的话

    ```js
    {
        capture: 是否是捕获,
        once: 是否只监听一次,
        passive: 如果为tru， preventDefault会失效。
    }
    ```

52. 如何写一个自定义事件

    ```js
    var ev = new Event("look", {"bubbles":true, "cancelable":false});
    document.addEventListener('look',()=>{
        ...
    })
    document.dispatchEvent(ev);

    var event = new CustomEvent('name', {
        detail: {
        },
        bubbles: ,
        cancelable:
    });
    xx.addEventListener('name', () => {
        // do
    })
    xx.dispatchEvent(event);

    // CustomEvent 比 event 多了个 detail 属性

    ```

53. V8 内存回收机制

    V8 给 JS 分配的内存实际上不多。在 64 位系统下也就一点几 G

    原因是因为 JS 是单线程运行的，这意味着一旦进入到垃圾回收，那么其它的各种运行逻辑都要暂停; 而且垃圾回收本身还是比较耗时的。

    V8 给堆内存分为新生代内存和老生代内存

    新生代内存，存活时间短，临时分配，在 64 位和 32 位系统下默认内存分别为 32MB 和 16MB。

    把新生代内存分成两块，一块为 from，一块为 to

    其中 From 部分表示正在使用的内存，To 是目前闲置的内存。

    当进行垃圾回收时，V8 将 From 部分的对象检查一遍，如果是存活对象那么复制到 To 内存中(在 To 内存中按照顺序从头放置的)，如果是非存活对象直接回收即可。

    当所有的 From 中的存活对象按照顺序进入到 To 内存之后，From 和 To 两者的角色对调，From 现在被闲置，To 为正在使用，如此循环。

    调换的原因是因为 From 那时候剩下的是内存碎片，分布在堆的各个位置，回收起来难度大，而 To 的话已经是复制过来剩余存活对象了，是整齐的。这时候就可以把新的 To 直接舍弃，清空。

    这样的好处是方便了第二轮后续内存分配。

    劣势是新生代内存被一分为二，空间利用率不高。

    老生代内存，存活时间长，新生代中的变量如果经过多次回收后依然存在，那么就会被放入到老生代内存中，这种现象就叫晋升。或者是 To 区空间的内存占用超过 25%，也会发生晋升。

    老生代的内存回收方式就是我们熟知的标记清除。先标记完了后，把这一轮剩余内存进行移动，往一端靠拢。然后再内存回收的过程中，时间会比较长，V8 也利用了类似 React fiber 一样，进行分片处理。

54. 自己实现一个 eventEmmiter(也就是发布订阅)

    ```js

    export default event = new EventEmmiter();
    event.addListener('eventName',callback)
    event.once();
    event.removeListener('');
    event.removeAllListener('');
    event.emmit('eventName', args);
    function callback(args) {
    }

    ```

    其实就是 pushHandler 就可以了, 完成版[eventEmmiter.js](https://zhenglin.vip/js/eventEmmiter.js)

    once 其实就是加一个 wrapperHandler,然后先 remove 再调用一次。

    主要就是利用个对象完成。

55. 隐式转换

    - 主要需要知道几点，转 String 的时候
    - String([]) = '';
    - String([1,2]) = '1,2';
    - String([null]) = '';
    - String([undefined]) = '';
    - 转 boolean 的时候
      假值只有 false、null、undefined、空字符、0 和 NaN，其它值转为布尔型都为 true。
    - 转 number 的时候
      Number(只有在字符串里由非数字的时候)NaN

      数组空转0，数组有一个数字就转它，数组有多个就是NaN

    `{} + {} = '[object Object][object Object]';`
    `2 * {} = NaN`

    - 遇到 == 的时候

    1. null == undefined 特例
    2. 如果左右是同类型的，除非都是 NaN，返回false，其他就比大小了。
    3. Number 和 String 比较的话，String 转 number;
    4. 如果有 Boolean 类型的话，优先转 Boolean 为 Number;
    5. 如果有任何一方是对象的话，转成原始类型
    ![tu](../img/type.jpg)

    `[] == !{} true`

    左边是对象，右边是 false，false 转数字是 0，[] tostring = '';''转数字是 0。

56. array.slice(), arr.splice, str.substr, str.substring

    下述的起始位置从 0 开始。

    - slice 第一个参数是起始位置，包含关系，第二个参数是结束为止，不包含。
    - splice 第一个参数是起始位置，包含关系，第二个参数是个数，第三个是插入的

    ```js

    var str = 'helloworld';
    str.substr(2,3) // llo
    str.substring(2,3) //l
    str.substring(2,2) //''

    ```

    - substr 第一个参数是起始位置，包含，第二个是 length
    - substring 第一个参数是起始位置，包含，第二个是 end，不包含

57. 像掘金，复制的时候会有掘金版权声明，如何做到的

    先监听用户复制，然后在回调函数里拿到复制的文本，当文本大于一定 Length 的时候，添加版权声明，然后把新的值 set 到剪切板里去。

58. vue 双向绑定的原理 2.0

    利用 Object.defineProperty， 在 get 的时候判断当前值有没有被添加过，没有添加过的话就添加订阅，在初始化的时候 watch，回调里就是 update dom 的方法。然后在 set 的时候，就会通知各订阅更新。然后各订阅收到消息后，调用自己的 update 方法，就是 watch 的回调。完成 update。然后 dom 元素比如 input 发生改变的话，给 input 上一个监听，改变的时候同时改变你 defineproperty 的值就完成双向绑定了。

59. vue 双向绑定原理 3.0

    其实就是把上面的方法换成 proxy

    [vue](https://zhenglin.vip/js/vue.js)

60. 数组和链表的对比

    - 数组静态分配内存，链表动态分配内存
    - 数组在内存中是连续的，而链表不一定是连续的
    - 数组利用下标定位，时间复杂度是 O(1)，链表只能一个一个查，时间复杂度是 O(n).
    - 数组插入或者删除动作的的时间复杂度是 O(n),链表的话是 O(1)。因为数组删除或者是插入后要移位。而链表直接解除或者添加即可。不过唯一缺点是它有一个额外的域，存放内存中下一节点的地址。

61. 微信小程序只展示最近的 20 个，最近命中的在上面，多的移除。

    利用一个双向循环链表，每次新插数据的时候，先查询，如果查到了，把数据移到链表头部，当数据满了，就讲链表尾部的丢弃。这个算法叫 LRU。
    比数组好的是，查询阶段，都是 O(n)，但是在移位阶段的时候，链表是 O(1)，数组是 O(n),删除尾部都是 O(1)

62. MessageChannel 是啥，vue 的 nexttick 实现原理是什么

    ```js

    myNextTick(fn){
        const ch = new MessageChannel();
        // 只有两个端口，一个 port1,一个 port2。正好叫这样。
        const port1 = ch.port1;
        const port2 = ch.port2;

        // 接受来自port1的postMessage
        port2.onmessage = (() => {
            fn();
        })
        port1.postMessage(1);

    }

    ```

    这也是 vue2.4 以前的 nexttick()实现方式。
    vue2.5 后，用的是 MutationObserver

    ```js

    function mynextTick(func) {
        var textNode = document.createTextNode('0')//新建文本节点
        var that = this
        var callback = function(mutationsList, observer) {
            func.call(that);
        }
        var observer = new MutationObserver(callback);
        observer.observe(textNode,{characterData:true })
        textNode.data = '1' //修改文本信息，触发dom更新
    }

    ```

    原因就是用微任务替代宏任务。还有其他深层次的原因。不了解，不是主 vue。

    以上实际是其中的一部分，实际上，`nexttick` 改了很多次。

    第一版的 nextTick 实现 timerFunc 顺序为`MutationObserver, setImmediate,setTimeout`

    第二版的实现为 `setImmediate, Messagechannel, setTimeout`

    最后一版本是`Promise.then,MutationObserver, setImmediate,setTimeout`

63. 为什么用settimeout模拟setinterval呢？

    setInterval 有两个缺点：
    1. 使用 setInterval 时，某些间隔会被跳过；比如这个执行任务很慢，结果等到T3要加入队列的时候，T2还没执行，所以会被跳过。这就是丢帧
    2. 可能多个定时器会连续执行；比如T1执行完，没有空的时间，所以T1执行完立即执行T2

    ![settimeout](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/730a96f90311403980e1e42c2d5d21c6~tplv-k3u1fbpfcp-zoom-1.image)

    每个 setTimeout 产生的任务会直接 push 到任务队列中；而 setInterval 在每次把任务 push 到任务队列前，都要进行一下判断(看上次的任务是否仍在队列中，如果有则不添加，没有则添加)。

64. 实现 get(obj, 'a.b.c', 0), 类可选链

    ```js
    // get(obj, 'a.b.c', 0);
    function get(data, path, defaultVal) {
        path = path.split('.');
        // for 版本
        for (var i = 0, len = path.length; i < len; i++) {
            if (data == null)
                return defaultVal;
            data = data[path[i]];
        }
        return data;
        // reduce版本
        return path.reduce((obj, q) => obj && obj[q] ? obj[q] : undefined, obj) || defaultVal
    }
    ```
65. 原始类型的转换优先级是什么？

    对象在转换类型的时候，会调用内置的 [[ToPrimitive]] 函数，对于该函数来说，算法逻辑一般来说如下：

    - 如果已经是原始类型了，那就不需要转换了
    - 调用 x.valueOf()，如果转换为基础类型，就返回转换的值
    - 调用 x.toString()，如果转换为基础类型，就返回转换的值
    - 如果都没有返回原始类型，就会报错

    ```js
    let a = {
        valueOf() {
            return 0
        },
        toString() {
            return '1'
        },
        [Symbol.toPrimitive]() {
            return 2
        }
    }
    1 + a // => 3
    ```

    需要注意的是，只有发生需要转换的时候，才会执行，比如 ==, + - 之类的，如果是=== 根本不会进这里

    所以如果需要达到 `a===1 && a===2 && a===3` 这样的条件，是只能通过数据劫持的get才能做到
