// apply 接收一个数组参数，返回函数结果
// 与 call 的唯一区别：参数是数组，需要用 ... 展开
Function.prototype.apply2 = function(context, args) {
    let fn = Symbol("fn");
    // 处理 null/undefined 指向 window，基本类型用 Object() 转成对象
    context = context == null ? window : Object(context);
    // 把当前函数挂到 context 上，通过隐式调用改变 this 指向
    context[fn] = this;
    // 展开数组，让每个元素作为独立参数传入
    let res = context[fn](...args);
    // 用完删除，不污染原对象
    delete context[fn];

    return res;
};
