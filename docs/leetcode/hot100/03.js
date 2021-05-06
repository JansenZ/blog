// 这题用 i 边界错误太多了，还是用count吧
// 本质上也是滑动窗口
// medium
var lengthOfLongestSubstring = function(s) {
    let start = 0;
    let max = 0;
    let map = new Map();
    let count = 0;
    for(var k of s) {
        // 这个判断是必要的，如果只用has的话，会出现后面的在最前面发现，从而导致也进来了。
        if(map.get(k) > start) {
            max = Math.max(max, count - start);
            // 别直接为count，是上轮获取的。
            start = map.get(k);
        }
        count++;
        map.set(k, count);
    }
    return Math.max(max, count - start);
};