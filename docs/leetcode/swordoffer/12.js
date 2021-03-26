// 绳子长n
// 分成m端
// 求最大的值
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