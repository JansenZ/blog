// bind 返回一个新函数，更换了this的指向，实际bind的传参是按call来的
// 里面的实现用apply和call都可以，
// 首先，我们为什么要加原型，
// 因为bind出来的function是支持new的，如果原来的function下有个getName的原型函数，不加原型你就找不到了。
// 其次为啥是Object.create呢，因为如果直接写boundFunction.prototype = fun.prototype
// 这样如果修改了最后新函数的原型，也会改到原来的fun，这也是不愿意看到的。
// 而用了Object.create，相当于继承，是新的。boundFunction.prototype和fun.prototype是独立的，想要联系要.__proto__就是通过属性上去找它的原型链。
// 那如果new新的boundFn，getName就可以通过a.__proto__.__proto__.getName获得。
Function.prototype.bind2 = function(ctx, ...args1) {
    const fun = this;
    
    const boundFunction = function(...args2) {
        fun.apply(ctx, args1.concat(args2));
    };

    boundFunction.prototype = Object.create(fun.prototype)

    return boundFunction;
};
