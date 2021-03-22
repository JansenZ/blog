var arr = [1,2,3,4,5];
const arr2 = arr.map((item, index) => {
    return item * 2;
});
// map会返回一个新数组

Array.prototype.map2 = function (callback, thisArg) {
    if(this === (void 0) || this === null) {
        throw new Error('this type err');
    }

    if(typeof callback !== 'function') {
        throw new Error('callback is not a function');
    }

    let A = Object(this);
    let len = A.length;
    let res = new Array(len);
    // 第一种，外挂，使用for in的话，本来就会跳过稀松数组。
    for(var idx in A) {
        res[idx] = callback.call(thisArg, A[idx], idx, A);
    }
    // 第二种，正常的
    for(let i = 0; i < len; i ++) {
        if(i in A) {
            res[i] = callback.call(thisArg, A[i], i, A);
        }
    }
    return res;
}