// 实现函数double Power(double base, int exponent)，求base的exponent次方。不得使用库函数，同时不需要考虑大数问题。

// 示例 1:

// 输入: 2.00000, 10
// 输出: 1024.00000
// 示例 2:

// 输入: 2.10000, 3
// 输出: 9.26100
// 示例 3:

// 输入: 2.00000, -2
// 输出: 0.25000
// 解释: 2-2 = 1/22 = 1/4 = 0.25
//  

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/shu-zhi-de-zheng-shu-ci-fang-lcof
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。


/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
// 非递归写法，吃不住-212213213123那个指数
var myPow = function(x, n) {
    if(n == 0) {
        return 1;
    }
    let c = n > 0 ? x : 1 / x;
    const m = Math.abs(n);
    const oldc = c;
    for(var i = 1; i < m; i ++) {
        c = c * oldc
    } 
    return c;
};
// 递归写法, 依然爆栈
var myPow = function(x, n) {
    if(n == 0) {
        return 1;
    }
    let c = n > 0 ? x : 1 / x;
    return c * myPow(c, Math.abs(n) - 1);
};
// 自己的优化
var myPow = function(x, n) {
    if(n == 0) {
        return 1;
    }

    let c = x;
    let absn = n;
    if(n < 0) {
        c = 1 / x;
        absn = -n;
    }
    if(absn % 2 == 0) {
        return myPow(c * c, absn / 2)
    }
    return c * myPow(c, absn - 1);
};

// 优化，别人的。思路就是如果n%2是0，那base就可以升级，然后n 就可以除以2
var myPow = function(x, n) {
    if(n==0) return 1
    if(n<0) return 1/myPow(x,-n)
    if(n%2) return x * myPow(x,n-1)
    return myPow(x*x,n/2)
};
