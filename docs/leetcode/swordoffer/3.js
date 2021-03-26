
// 请实现一个函数，把字符串 s 中的每个空格替换成"%20"。
// 示例 1：
// 输入：s = "We are happy."
// 输出："We%20are%20happy."
// 限制：
// 0 <= s 的长度 <= 10000
/**
 * @param {string} s
 * @return {string}
 */
var replaceSpace = function(s) {
    return s.replace(/\s/g, '%20');
};
var replaceSpace = function(s) {
    var s2 = '';
    for(var i = 0; i < s.length; i ++) {
        let v = s.charAt(i);
        s2 = s2 + (v == ' ' ? '%20' : v);
    }
    return s2;
};