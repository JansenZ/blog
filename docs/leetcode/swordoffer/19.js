// 请实现一个函数用来匹配包含'. '和'*'的正则表达式。模式中的字符'.'表示任意一个字符，而'*'表示它前面的字符可以出现任意次（含0次）。在本题中，匹配是指字符串的所有字符匹配整个模式。例如，字符串"aaa"与模式"a.a"和"ab*ac*a"匹配，但与"aa.a"和"ab*a"均不匹配。

// 示例 1:

// 输入:
// s = "aa"
// p = "a"
// 输出: false
// 解释: "a" 无法匹配 "aa" 整个字符串。
// 示例 2:

// 输入:
// s = "aa"
// p = "a*"
// 输出: true
// 解释: 因为 '*' 代表可以匹配零个或多个前面的那一个元素, 在这里前面的元素就是 'a'。因此，字符串 "aa" 可被视为 'a' 重复了一次。
// 示例 3:

// 输入:
// s = "ab"
// p = ".*"
// 输出: true
// 解释: ".*" 表示可匹配零个或多个（'*'）任意字符（'.'）。
// 示例 4:

// 输入:
// s = "aab"
// p = "c*a*b"
// 输出: true
// 解释: 因为 '*' 表示零个或多个，这里 'c' 为 0 个, 'a' 被重复一次。因此可以匹配字符串 "aab"。
// 示例 5:

// 输入:
// s = "misssssissippi"
// p = "mis*is*p*."
// 输出: false
// s 可能为空，且只包含从 a-z 的小写字母。
// p 可能为空，且只包含从 a-z 的小写字母以及字符 . 和 *，无连续的 '*'。

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/zheng-ze-biao-da-shi-pi-pei-lcof
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function(s, p) {
    let si = 0;
    let pi = 0;
    let len = s.length;
    if(p == '.*') return true;
    while(si < len) {
        // 相等或有.直接++
        if(s[si] == p[pi] || p[pi] == '.') {
            si++;
            pi++;
        }
        // 说明p既不是*也不是+1*
        else if(p[pi] !== '*' && p[pi + 1] !== '*') {
            return false;
        }
        // 不相等的情况, 看p的后面一个是不是*，如果是*，可以抵消。
        else if(p[pi + 1] == '*') {
            si++;
            pi+=2;
        }
        // 不相等的情况下，假设p是*， 说明他们前面一定都是相等的，直接吃掉所有的s前面的值。
        else if(p[pi] == '*') {
            // .* 匹配一起，但是.*后面如果有值的话，还得预留？这怎么留？
            // 吃还是不吃？吃几个？
            // todo,改递归？
            while(s[si] == s[si - 1]){
                si++;
            }
            pi++;
        }
    }
    return true;
};



// 改成从后往前匹配呢？会不会有奇效？
var isMatch = function(s, p) {
    let len1 = s.length;
    let len2 = p.length;
    let si = len1 - 1;
    let pi = len2 - 1;
    if(p == '.*') return true;
    while(si >= 0 || pi >= 0) {
        // 相等或遇到超级通配
        if(s[si] == p[pi] || p[pi] == '.') {
            si--;
            pi--;
        } else if(p[pi] == '*') {
            // 模式串遇到*号
            // 看前一个是否相等
            if(p[pi - 1] == '.' || p[pi - 1] == s[si]) {
                // 相等，吃掉s
                while(s[si] == s[si - 1]) {
                    // todo
                    si--;
                }
                pi--;
            } else {
                // 不相等
                // 跳过p
                pi-=2;
            }
        }
        else {return false;}
    }
    return true;
}


// 感觉没有递归写不了，还是递归试试吧
var isMatch = function(s, p) {
    let len1 = s.length;
    let len2 = p.length;
    let si = len1 - 1;
    let pi = len2 - 1;
    if(p == '.*' || s == p) return true;
    // 相等或遇到超级通配
    if(s[si] == p[pi] || p[pi] == '.') {
        return isMatch(s.slice(0, si), p.slice(0, pi));
    }
    if(p[pi] == '*') {
        // 模式串遇到*号
        // 看前一个是否相等
        if(p[pi - 1] == '.' || p[pi - 1] == s[si]) {
            // 相等，吃掉s,其实也可以跳过的。
            let res = false;
            while (s[si] == s[si - 1]) {
                res = res || isMatch(s.slice(0, si), p.slice(0, pi - 1)) || isMatch(s, p.slice(0, pi - 1));
                si --;
            };
            res = res || isMatch(s.slice(0, si), p.slice(0, pi - 1));
            return res;
        } else {
            // 不相等
            // 跳过 x*
            return isMatch(s, p.slice(0, pi - 1));
        }
    }
    return false;
}

// 最后也没写出来