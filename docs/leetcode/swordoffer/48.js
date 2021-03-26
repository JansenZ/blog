// 面试题48. 最长不含重复字符的子字符串
// 请从字符串中找出一个最长的不包含重复字符的子字符串，计算该最长子字符串的长度。



// 示例 1:

// 输入: "abcabcbb"
// 输出: 3 
// 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
// 示例 2:

// 输入: "bbbbb"
// 输出: 1
// 解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
// 示例 3:

// 输入: "pwwkew"
// 输出: 3
// 解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
//      请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
 

// 提示：

// s.length <= 40000


/**
 * @param {string} s
 * @return {number}
 */
// 这道题调试了好几次，每次都改了一点错误。
// 首先要明确的是，不能直接把数组给割了，因为这样会导致下标位置错乱。
var lengthOfLongestSubstring = function(s) {
    let max = 0;
    let hash = {};
    let arr = [];
    // 标记一个上次失败的位置
    let lastErrIdx = 0;
    for(var k = 0; k < s.length; k ++) {
        // 如果得到值，并且大于上次失败的位置，才能算遇到重复的了
        // 如果没有大于这个判断， ab ba，第一次b失败后，应该是清除ab的，第二次遇到a就不应该进这里，否则失配位会变成1
        if(hash[s[k]] > lastErrIdx) {
            // 说明遇到重复的了
            max = Math.max(max, arr.length - lastErrIdx);
            lastErrIdx = hash[s[k]];
            // 去找它的下标+1
        }
        arr.push(s[k]);
        // 更新它的下标+1
        hash[s[k]] = arr.length;
    }
    // 返回的时候，为啥还要走一遍，是因为有可能最后一次一直没有遇到重复的，导致max不会更新，所以结束的时候需要强制更新一次。
    return Math.max(max, arr.length - lastErrIdx);
};



// 做到后面发现上一把的arr根本没用上，改进一下
var lengthOfLongestSubstring = function(s) {
    let map = {};
    let max = 0;
    let errCount = 0;
    let count = 0;
    for(var k of s) {
        if(map[k] > errCount) {
            max = Math.max(max, count - errCount);
            errCount = map[k];
        }
        count ++;
        map[k] = count;
    }
    return Math.max(max, count - errCount);
};

// abca
// 记下当前max
// 去掉找到他自己的位置的那个，移动多少位数


// pwwkew

// kew 3

// abcabc
// abc.
// bca.
// cab.
// abc.

// abba
// ab
// ab ba