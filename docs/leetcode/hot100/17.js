// 采用深度遍历的方式来写
var letterCombinations = function(digits) {
    if(!digits) return [];
    var letter = {
        2: 'abc',
        3: 'def',
        4: 'ghi',
        5: 'jkl',
        6: 'mno',
        7: 'pqrs',
        8: 'tuv',
        9: 'wxyz'
    };
    let res = [];
    let len = digits.length;
    dfs(0, '');
    return res;

    function dfs(i, str) {
        if(i >= len) {
            res.push(str);
            return;
        }
        let dd = letter[digits[i]];
        for(let s of dd) {
            dfs(i + 1, str + s);
        }
    }
}