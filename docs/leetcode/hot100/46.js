// 全排列，和39题其实一样的，经典回溯
// 多了一个jumpmap，跳过已经用了的那个值。
var permute = function(nums) {
    let res = [];
    let len = nums.length;

    function dfs(jumpMap, arr) {
        if(arr.length == len) {
            res.push(arr.slice());
            return;
        }
        for(let i = 0; i < nums.length; i++) {
            if(jumpMap.has(i)) continue;
            jumpMap.set(i, 1);
            arr.push(nums[i]);
            dfs(jumpMap, arr);
            arr.pop();
            jumpMap.delete(i);
        }
    }

    dfs(new Map(), []);
    return res;
};