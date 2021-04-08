// 我们把只包含因子 2、3 和 5 的数称作丑数（Ugly Number）。求按从小到大的顺序的第 n 个丑数。
// 示例:

// 输入: n = 10
// 输出: 12
// 解释: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12 是前 10 个丑数。
// 说明:  

// 1 是丑数。
// n 不超过1690。

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/chou-shu-lcof
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



// 核心就是，1235之后的每个数，实际上都是由1，2，3，5变出来的
// 比如4就是2*2变出来的
// 6就是3*2编出来的
// 但是5*2 = 10，2*5也是10
// 所以要看谁先出，所以要有个math.min的比较，用3个指针。
function getNum(n) {
    let dp = [1, 2, 3];
    var m2 = 1, m3 = 1, m5 = 5;
    var c1 = 1; c2 = 1; c3 = 1;
    for(var i = 3; i < n; i ++) {
        let cp = dp[i - 1];
        while(m2 <= cp) {
            m2 = 2 * dp[c1];
            c1++;
        }
        while(m3 <= cp) {
            m3= 3 * dp[c2];
            c2++;
        }
        while(m5 <= cp) {
            m5= 5 * dp[c3];
            c3++;
        }
        dp[i] = Math.min(m2, m3, m5);
    }
    return dp[n -1];
}