
// 利用中心扩散法
// for循环，
// 然后从中间开始，看它的左边和右边，只要相等，就可以l--,r++
// 然后计算出r-l和当前res的length谁大用谁。

// 两种情况
// 一种是回文子串长度为奇数（如aba，中心是b），左右两边都是i
// 另一种回文子串长度为偶数（如abba，中心是b，b），左右两边是i和i+1
var longestPalindrome = function(s) {
    if (s.length < 2){
        return s
    }

    let res = ''
    for(var i = 0; i < s.length; i++) {
        helper(i, i);
        helper(i, i + 1);
    }
    function helper(l, r) {
        while(l >= 0 && r < s.length && s[l] == s[r]){
            l--;
            r++;
        }
        if(r - l - 1 > res.length) {
            res = s.slice(l + 1, r);
        }
    }

    return res;
};

// 首先，回文串就是中间那个扩散后，依然相等
// 假设起始位置是i，结束为止是j
// 分三种情况，i = j,true,因为就自己一个字符
// i + 1 = j，匹配两者是否相等
// 其他情况，dp[i][j] = dp[i + 1][j - 1] 以及 s[i] == s[j]
// 这里由于i要加，j要减，所以for循环i从末尾开始，j从i开始。
var longestPalindrome = function(s) {
    if(s.length < 2) return s;
    var dp = [];
    var str = '';
    for(var i = s.length - 1; i >= 0; i --) {
        dp[i] = [];
        for(var j = i; j < s.length; j++) {
            if(i == j) dp[i][j] = true;
            else if(i + 1 == j && s[i] == s[j]) dp[i][j] = true;
            else dp[i][j] = dp[i + 1][j - 1] && s[i] == s[j];
            if(dp[i][j] && j - i + 1 > str.length) str = s.slice(i, j + 1);
        }
    }
    return str;
};
