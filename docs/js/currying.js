// 柯里化
const add = (...arg) => arg.reduce((prev, curr) => curr += prev, 0);
const currying = (fn, ...arg1) => (...arg2) => ((arg2.length === 0) ? fn(...arg1) : currying.call(null, fn, ...arg1, ...arg2))
const curryAdd = currying(add);
curryAdd(1, 2)(3)(4)();
curryAdd(1, 2)(3, 4)();
curryAdd(1)(2)(3)(4)();
// 咱们通俗一下
function currying(fn, ...args1) {
    return function(...args2) {
        if(!args2.length) {
            return fn.call(null, ...args1);
        } else {
            return currying.call(null, fn, ...args1, ...args2);
        }
    }
}
// 这样确实解决了我的问题
// 不会一直存参数，原来写的是有问题的
// 所以没必要返回内部的函数，直接返回curring再包装就可以。
// 以下是老的，虽然是按照思路来的，但是不对，会存下来args
function currying(fn) {
    let args1 = [];
    return function ins(...args2) {
        if(!args2.length) {
            fn.call(null, args1);
        } else {
            args1 = args1.concat(args2);
            return ins;
        }
    }
} 

