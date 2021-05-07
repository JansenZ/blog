// 经典回溯题目
var combinationSum = function(candidates, target) {
    let res = [];
    dfs(res, candidates, 0,  target, []);
    return res;
};

function dfs(res, arr, start,  target, sigArr) {
    if(target <= 0) {
        target == 0 && res.push(sigArr);
        return;
    }
    for(let i = start; i < arr.length; i++) {
        dfs(res, arr, i, target - arr[i], sigArr.concat(arr[i]));
    }
}
// 两版的区别在于，下面属于真正的经典回溯，就是先push，后pop，由于是一个引用，所以push结果的时候要slice
var combinationSum = function(candidates, target) {
    let res = [];
    dfs(res, candidates, 0,  target, []);
    return res;
};

function dfs(res, arr, start,  target, sigArr) {
    if(target <= 0) {
        target == 0 && res.push(sigArr.slice());
        return;
    }
    for(let i = start; i < arr.length; i++) {
        sigArr.push(arr[i]);
        dfs(res, arr, i, target - arr[i], sigArr);
        sigArr.pop();
    }
}