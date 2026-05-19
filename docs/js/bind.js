// bind 返回一个新函数，更换了this的指向
// 支持柯里化：bind时传部分参数，调用时再传剩余参数
// 支持new：new出来的实例this优先级高于bind绑定的ctx
Function.prototype.bind2 = function(ctx, ...args1) {
    const fn = this;

    const boundFn = function(...args2) {
        // this instanceof boundFn 判断是否是 new 调用
        // new 调用时 this 是新实例，普通调用时用绑定的 ctx
        return fn.call(
            this instanceof boundFn ? this : ctx,
            ...args1.concat(args2)
        );
    };

    // Object.create 而不是直接赋值，避免修改新函数原型时污染原函数原型
    boundFn.prototype = Object.create(fn.prototype);

    return boundFn;
};
