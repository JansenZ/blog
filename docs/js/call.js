// call 返回函数执行结果
Function.prototype.call2 = function(context, ...args) {
    let fn = Symbol("fn");
    context = context || window;
    context[fn] = this;

    let res = context[fn](...args);

    delete context[fn];

    return res;
};
