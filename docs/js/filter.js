var arr = [1,2,3,4,5];
const arr2 = arr.filter((item, index) => {
    return item > 3;
});

// filter 返回一个筛选过后的数组
Array.prototype.filter2 = function (callback, thisArg) {
    if(this === (void 0) || this === null) {
        throw new Error('this type err');
    }

    if(typeof callback !== 'function') {
        throw new Error('callback is not a function');
    }

    let A = Object(this);
    let res = [];
    
    for(var idx in A) {
        let val = A[idx];
        callback.call(thisArg, val, idx, A) && (res.push(val));
    }

    return res;
}