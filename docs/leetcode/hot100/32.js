// 最长有效子串括号
// 遇到左的时候push
// 遇到右的时候计算。
//  需要一个哨兵位置，也就是 -1；
var longestValidParentheses = function(s) {
    let max = 0;
    let res = [-1];
   for(i in s) {
        if(s[i] == '(') {
            res.push(i);
        } else {
            res.pop();
            if(res.length) {
                max = Math.max(max, i - res[res.length - 1]);
            } else {
                // 这个位置，就是如果多个右括号，这个时候因为-1也被干掉了，哨兵位也要跟着更新。更新为当前右括号的这个下标。
                res.push(i);
            }
        }
   }
   return max;
};