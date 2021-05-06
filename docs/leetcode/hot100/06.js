// 这样的题，需要拿笔写
// [0][0]
// [1][0]
// [2][0]

// [1][1]

// [row-1][col+1]

// if(row-1 == 0) 
// 开始下一轮


var convert = function(s, numRows) {
    if(numRows < 2){
        return s
    }
    let res = Array.from({ length: numRows}, ()=> []);
    let c = 0;
    let row = 0;
    let col = 0;
    for(var val of s) {
        if(c < numRows) {
            res[row++][col] = val;
            c++;
        } else {
            res[--row - 1][++col] = val;
            // 可以开启下一轮了
            // 但是当它等于0 的时候，其实就已经算是下一轮的第一个了
            // 所以c不能从0开始，要从1开始
            if(row - 1 == 0) {
                c = 1;
            }
        }
    }
    let str = '';
    for(var i = 0; i < res.length; i ++) {
        // for of 无法跳过稀松数组
        // 需要改用 for in
        for(var idx in res[i]) {
            str+=res[i][idx];
        }
    }
    return str;
};

// 以上是需要打印数组的情况下，假设不需要打印数组的情况下，我们其实是没有必要用数组的。

// 没有必要用col了，直接res[roww++] += val, res[--row -1] += val; 最后str+=res[i]， 就可以了。