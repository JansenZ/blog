// apply 返回函数结果
Function.prototype.apply2 = function(context, args) {
    let fn = Symbol('fn');
    context = context || window;
    context[fn] = this;

    let res = context[fn](args);

    delete context[fn];

    return res;
}
