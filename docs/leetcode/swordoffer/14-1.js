// 绳子长n
// 分成m端
// 求最大的值

// 给你一根长度为 n 的绳子，请把绳子剪成整数长度的 m 段（m、n都是整数，n>1并且m>1），
// 每段绳子的长度记为 k[0],k[1]...k[m-1] 。请问 k[0]*k[1]*...*k[m-1] 可能的最大乘积是多少？
// 例如，当绳子的长度是8时，我们把它剪成长度分别为2、3、3的三段，此时得到的最大乘积是18。


// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/jian-sheng-zi-lcof
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

var map = new Map();
var cuttingRope = function(n) {
    if(n == 2) {
        return 1;
    }
    if(n == 3) {
        return 2;
    }
    if(n > 3) {
        return cuttingMoreRope(n);
    }
};
var cuttingMoreRope = function(n) {
    if(n < 5) {
        return n;
    }
    if(map.get(n)) {
        return map.get(n);
    }
    let max = cuttingMoreRope(n-1);
    for(let i = 2; i <= n / 2; i ++) {
        max = Math.max(max, cuttingMoreRope(i) * cuttingMoreRope(n - i))
    }
    map.set(n, max);
    return max;
};


//  根据规律，可以知道，3是最佳的，所以还可以换一个方式
var cuttingRope = function(n) {
    if(n == 2) {
        return 1;
    }
    if(n == 3) {
        return 2;
    }
    var count = Math.floor(n / 3);
    var rest = n % 3;
    if(rest == 0) {
        return Math.pow(3, count);
    }
    if(rest == 1) {
        return Math.pow(3, count - 1) * 4;
    }
    if(rest == 2) {
        return Math.pow(3, count) * 2;
    }
};