var arr = [1,2,3,4,5];
const arr2 = arr.reduce((a, b, index, arr) => {
    return a + b;
}, 10);

// reduce
Array.prototype.reduce2 = function (callback, initval) {
    if(this === (void 0) || this === null) {
        throw new Error('this type err');
    }

    if(typeof callback !== 'function') {
        throw new Error('callback is not a function');
    }

    let idx = 0;
    let len = A.length;
    let A = Object(this);
    let pre = initval;

    // 这里可以扩展下，如果是稀松数组的话，可以加个循环
    if(!pre) {
        idx ++;
        pre = A[0];
    }

    
    for(; idx < len; idx ++) {
        if(idx in A) {
            pre = callback(pre, A[idx], idx, A);
        }
    }

    return pre;
}


Array.prototype.reduce2 = function(callback, initVal) {
    const oldArr = this;
    if(!Array.isArray(oldArr) || !oldArr.length || typeof callback !== 'function') {
        return [];
    }
    let res = [];
    let hasInitVal = initVal !== undefined;
    let preVal = hasInitVal ? initVal : oldArr[0]; 
    let startIndex = hasInitVal ? 0 : 1;

    for(let i = startIndex; i < oldArr.length; i ++) {
        preVal = callback(preVal,oldArr[i], i, oldArr);
    }
    return preVal;
}