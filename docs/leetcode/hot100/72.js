// 最短编辑距离
// 类似最长公共子序列
// 但是这个暂时先背一下吧先
// 初始化就是两边的路径的值要等于i
// 然后如果相等就不要加，因为不需要增删改查
// 如果不相等就取增，删，改里面的最小的那个 + 1

/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function(word1, word2) {
    let n1 = word1.length;
    let n2 = word2.length;
    let dp = Array.from({ length: n1 + 1}, () => new Array(n2 + 1).fill(0));

    for(let i = 1; i <= n1; i ++) {
        dp[i][0] = i;
    }
    for(let j = 1; j <= n2; j++) {
        dp[0][j] = j;
    }

    for (let i = 1; i <= n1; i++) {
        for (let j = 1; j <= n2; j++) {
            // 如果 word1[i] 与 word2[j] 相等。第 i 个字符对应下标是 i-1
            if (word1[i - 1] == word2[j - 1]){
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]) + 1;
            }         
        }
    }
    return dp[n1][n2];
};