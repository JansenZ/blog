// 最大正方形
// 需要有一个max，因为路径上不一定就是最大的。
// dp[i][j] = Math.min(dp[i - 1][j], dp[i-1][j-1], dp[i][j-1]) + 1;
/**
 * @param {character[][]} matrix
 * @return {number}
 */
var maximalSquare = function(matrix) {
    let row = matrix.length;
    let col = matrix[0].length;
    let dp = Array.from({length: row + 1}, () => new Array(col + 1).fill(0));
    let max = 0;
    for(var i = 1; i <= row; i ++) {
        for(var j = 1; j<=col; j++) {
            if(matrix[i - 1][j - 1] == 1) {
                dp[i][j] = Math.min(dp[i - 1][j], dp[i-1][j-1], dp[i][j-1]) + 1;
                max = Math.max(max, dp[i][j]);
            }
        }
    }
    return max * max
};