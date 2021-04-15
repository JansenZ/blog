// 在一个 n * m 的二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。
//  
// 示例:
// 现有矩阵 matrix 如下：
// [
//   [1,   4,  7, 11, 15],
//   [2,   5,  8, 12, 19],
//   [3,   6,  9, 16, 22],
//   [10, 13, 14, 17, 24],
//   [18, 21, 23, 26, 30]
// ]
// 给定 target = 5，返回 true。
// 给定 target = 20，返回 false。
//  
// 限制：
// 0 <= n <= 1000
// 0 <= m <= 1000
// [18, 21, 23, 26, 30, 33]
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var findNumberIn2DArray = function(matrix, target) {
    let mlen = matrix.length;
    if(mlen == 0) return false;
    let slen = matrix[0].length;
    for(let i = 0; i < mlen; i ++) {
        let first = matrix[i][0];
        let last = matrix[i][slen - 1];
        if(target > last) {
            continue;
        }
        if(target < first) {
            return false;
        }
        if(target == first || target == last) {
            return true;
        }
        let mid = Math.floor(slen / 2);
        let end = slen - 1;
        while(mid > 0 && mid < end) {
            if(target == matrix[i][mid]) {
                return true;
            }
            if(target > matrix[i][mid]) {
                mid = Math.floor((mid + end + 1) / 2);
            }
            else {
                end = mid;
                mid = Math.floor(mid / 2);
            }
        }
    }
    return false;
};

// 2分法
// 每一排都要看