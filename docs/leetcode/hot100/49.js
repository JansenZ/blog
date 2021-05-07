// 对数组里的值，进行sort，然后存到map组里
// 存到map组里的值为res.length - 1，
// 这样正好利用它的下标来push str
var groupAnagrams = function(strs) {
    let res = [];
    let map = new Map();
    for(var str of strs){
        let targetStr = str.split('').sort().join('');
        if(map.has(targetStr)) {
            res[map.get(targetStr)].push(str);
        } else {
            res.push([str])
            map.set(targetStr, res.length - 1);
        }
    }
    return res;
};