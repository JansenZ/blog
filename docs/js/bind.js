// bind 返回新函数，实际就是换了个this。也就是apply把新的context放进去就可以了
// 首先，我们为什么要加原型，
// 因为bind出来的function是可以new的，并且还要指向原来的函数，所以需要原型
// 其次，为啥下面的改成用空函数呢
// 因为如果直接修改res.prototype = self.prototype
// 一样会改 到原函数的原型。所以用下面的中转一下。
Function.prototype.bind2 = function(ctx, ...args1) {
    const self = this;

    const Fn = function() {};

    const res = function(...args2) {
        self.apply(ctx, args1.concat(args2));
    };

    Fn.prototype = self.prototype;

    res.prototype = new Fn();

    return res;
};
