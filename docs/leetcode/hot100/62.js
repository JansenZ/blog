/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
// 经典回溯
// 但是这样时间很长
// var uniquePaths = function(m, n) {
//     let res = 0;
//     let target = m + n - 2;

//     dfs(0, 0, 0);

//     function dfs(i, j, step) {
//         if(i < m && j < n && step == target) {
//             res++;
//             return;
//         }
//         if(i < m  && j < n) {
//             dfs(i + 1, j, step + 1);
//             dfs(i, j + 1, step + 1);
//         }
//     }
//     return res;
// };
// 改用动态规划
// 发现好像没啥好写的。
// 需要注意的就是默认值要填1；
// j也要从1开始，因为是动态规划，肯定每个坐标都要有啊。
var uniquePaths = function(m, n) {
    let dp = Array.from({length: m}, ()=> new Array(n).fill(1));
    for(let i = 1; i < m; i++) {
        for(let j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1][n - 1];
};