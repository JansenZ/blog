// 单词拆分
// 超时了
// 挨个遍历去找
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {
    let len = s.length;
    let wordSet = new Set(wordDict);
    let memo = new Array(len);

    function isValid(start) {
        // 跑完了
        if(start == len) return true;
        if (memo[start]) return memo[start]; // memo中有，就用memo中的
        for(var i = start + 1; i <= len;i++) {
            let ss = s.slice(start, i);
            if(wordSet.has(ss) && isValid(i)) {
                memo[start] = true;
                return true;
            }            
        }
        memo[start] = false;
        return false;
    }
    return isValid(0);
};