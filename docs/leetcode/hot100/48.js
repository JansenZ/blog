// 反转数组后，发现i,j变换的位子就是j,i。
// 而且j可以从i开始
var rotate = function(matrix) {
    matrix.reverse();
    let n = matrix.length;
    for(var i = 0;i < n; i ++){
        for(var j = i; j < n;j++){
            [matrix[i][j],matrix[j][i]] = [matrix[j][i],matrix[i][j]];
        }
    }
};


// 朴实的做法
// 原地交换
// 只要是发生了变换的
// 对向坐标都要记录下来，loop要跳过
// 还要求得当前坐标要变换的值是多少。
var rotate = function(matrix) {
    let row = matrix.length;
    let map = new Map();
    for(var i = 0; i < row; i ++) {
        for(var j = 0; j < row; j ++) {
            // 跳过已经去交换过去成功的target
            if(map.has(i + '-' + j)) continue;
            // 获取要换过去的坐标
            let target = getCor(i, j);
            map.set(target.i + '-' + target.j, 1);
            // 交换
            [matrix[i][j], matrix[target.i][target.j]] = [matrix[target.i][target.j], matrix[i][j]];
        }
    }
    function getCor(i, j) {
        return {
            i: j,
            j: row - i - 1
        }
    }
};