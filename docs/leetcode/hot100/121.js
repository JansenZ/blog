// 经典dp
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let len = prices.length;
    if(!len) return 0;
    let min = prices[0];
    let dp = [0];
    for(var i = 1; i < len; i ++) {
        min = Math.min(min, prices[i]);
        dp[i] = Math.max(dp[i-1], prices[i] - min);
    }
    return dp[len - 1];
};