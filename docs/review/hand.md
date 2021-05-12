### Call

<details open>

[filename](../js/call.js ':include :type=code')

</details>

### Apply

<details open>

[filename](../js/apply.js ':include :type=code')

</details>

### Bind

<details open>

[filename](../js/bind.js ':include :type=code')

</details>

### New

<details open>

[filename](../js/new.js ':include :type=code')

</details>

### Debounce

<details open>

[filename](../js/debounce.js ':include :type=code')

</details>

### Throttle

<details open>

[filename](../js/throttle.js ':include :type=code')

</details>

### Compose

<details open>

[filename](../js/compose.js ':include :type=code')

</details>

### 红绿灯Promise

<details open>

[filename](../js/red-green-yellow.js ':include :type=code')

</details>

### 柯里化

<details open>

[filename](../js/currying.js ':include :type=code')

</details>

### Filter

<details open>

[filename](../js/filter.js ':include :type=code')

</details>

### Map

<details open>

[filename](../js/map.js ':include :type=code')

</details>

### Reduce

<details open>

[filename](../js/reduce.js ':include :type=code')

</details>

### 迭代器

<details open>

```js
function createIterator(items) {
       var i = 0;
       return {
           next: function() {
               var done = i >= items.length;
               var value = !done ? items[i++] : undefined;

               return {
                   done,
                   value
               };
           }
       };
   }
```

</details>

### Promise

[promise](https://zhenglin.vip/js/promise.js)

### Vue

[vue.js](https://zhenglin.vip/js/vue.js)

### Mobx

[mobx](https://zhenglin.vip/js/mobx.js)

### deepCopy

[deepcopy](https://zhenglin.vip/js/deepcopy.js)

### eventEmmiter

[eventEmmiter](https://zhenglin.vip/js/eventEmmiter.js)
