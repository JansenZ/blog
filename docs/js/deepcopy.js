function deepCopy(target, hash = new WeakMap()) {

    // const boolTag = '[object Boolean]';
    // const dateTag = '[object Date]';
    // const errorTag = '[object Error]';
    // const numberTag = '[object Number]';
    // const regexpTag = '[object RegExp]';
    // const stringTag = '[object String]';
    // 以上的这些特殊类型
    if(isSpecialObject(target)) {
        const Cstr = target.constructor;
        return new Cstr(target);
    }
    // 如果是正则的话，其实正则可以写到上面的特殊类型里。我试验了一下没区别。
    if(Object.prototype.toString.call(target) == '[object RegExp]') {
        return new RegExp(target.source, target.flags);
    }

    // 不是基本类型
    if(!isBaseObject(target)) {
        return target;
    }

    // 代表循环引用出现了
    if(hash.has(target)) {
        return hash.get(target);
    };

    let cloneObj = Array.isArray(target) ? [] : {};
    hash.set(target, cloneObj);
    for(var k in target) {
        // 递归的递
        cloneObj[k] = deepCopy(target[k]);
    }
    // 递归的归
    return cloneObj;
};

function isBaseObject(target) {
    const objs = ['[object Object]','[object Array]'];
    const type = Object.prototype.toString.call(target);
    return objs.includes(type);
}

function isSpecialObject(target) {
    const type = Object.prototype.toString.call(target);
    const objs = ['[object Boolean]','[object Date]','[object Error]'];// 没列全，知道即可
    return objs.includes(type);
}
