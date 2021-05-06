// 这题采用回溯方式解决
// 不过要把左右拆开来看
// 同时，二次判断的时候是左边大于右边才去填补)。不然直接用右边 < n会出现不成对的括号。
var generateParenthesis = function(n) {
    let res = [];

    function dfs(l, r, str) {
        if(l >= n && r >= n) {
            res.push(str);
            return;
        }
        if(l < n) {
            dfs(l + 1, r, str + '(');
        }
        if(l > r) {
            dfs(l, r + 1, str + ')');
        }
    }

    dfs(0, 0, '');
    return res;
};