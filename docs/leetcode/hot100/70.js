// 爬楼梯，经典动态规划，没啥说的
var climbStairs = function(n) {
    if(n < 3) return n;
    let pre = 1;
    let cur = 2;
    for(var i = 3; i <= n; i ++) {
        let next = pre + cur;
        pre = cur;
        cur = next;
    }
    return cur;
};