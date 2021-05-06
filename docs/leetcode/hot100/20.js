// 好像没啥好说的
var isValid = function(s) {
    let res = [];
    let map = {
        '(': ')',
        '{': '}',
        '[': ']'
    }
    for(k of s) {
        if(k == '(' || k == '{' || k == '[') {
            res.push(k);
        }
        else if(k == ')' || k =='}' || k == ']') {
            let d = res.pop();
            if(map[d] != k) return false;
        }
    }
    return !res.length;
};