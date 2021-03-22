
// 复合函数
function compose(...funcs) {
    // 如果没有length的话，就是compose();生成一个传啥吐啥的函数
    if (funcs.length === 0) {
        return arg => arg;
    }

    // 如果length是1，直接返回进来的这个func，当然也可能是值类型
    if (funcs.length === 1) {
        return funcs[0];
    }

    // 这才是核心代码
    return funcs.reduce((a, b) => {
        return (...args) => {
            return a(b(...args));
        };
    });
}

let x = 10;
function fn1(x) {
    return x + 1;
}
function fn2(x) {
    return x + 2;
}
function fn3(x) {
    return x + 3;
}
function fn4(x) {
    return x + 4;
}

let composeFn = compose(fn1, fn2, fn3, fn4);
let b = composeFn(x) // 理论上也应该得到20


// 主要解读一下reduce里的代码
// 第一轮进去的肯定是fn1, fn2
// 生成下一轮的a 就是 (...args) => fn1(fn2(...args))
// 那么第二轮返回的就是

var a = (...args) => fn1(fn2(...args))
(...args) => a(fn3(...args))

// 那么也就是说，fn3(...args)就是a的参数，填进去就是fn1(fn2(fn3(...args)))
// 所以最后就是 let a = fn1(fn2(fn3(fn4(x)))) // 10 + 4 + 3 + 2 + 1 = 20 满足需求
