// 动态规划经典路径
/**
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum = function(grid) {
    let x = grid.length;
    let y = grid[0].length;
    var dp = Array.from(new Array(x + 1), () => new Array(y + 1).fill(Infinity));
    for(var i = 1; i <= x; i++) {
        for(var j = 1; j <= y; j++) {
            let rs = Math.min(dp[i - 1][j], dp[i][j - 1]);
            rs = rs == Infinity ? 0 : rs;
            dp[i][j] = rs + grid[i - 1][j - 1];
        }
    }
    return dp[x][y];    
};