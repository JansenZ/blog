
// 01背包问题
// 视频问题
// private int[] items = {2，2，4，6，3};  // 物品的重量
// private int[] value = {3，4，8，9，6}; // 物品的价值
// private int n = 5; // 物品个数
// private int w = 9; // 背包承受的最大重量

// dp[1] = 0;
// dp[2] = 4;
// dp[3] = 6;
// dp[4] = 8;
// dp[5] = 10;
// dp[6] = 12;
// dp[7] = 14;

// 背包问题
// 重量
let weights = [2,2,6,5,4]; 
// 价值
let values = [6,3,5,4,6];
// 总重量
let w = 10;

function getMaxVal(w, weights, values) {
    var dp = new Array(w + 1).fill(0);
    debugger;
    for (var i = 0; i < weights.length; i++) {
        for (var weight = w; weight >= weights[i]; weight--) {
            dp[weight] = Math.max(dp[weight], dp[weight - weights[i]] + values[i]);
        }
    }
    return dp[w];
}
getMaxVal(10, [2,2,6,5,4], [6,3,5,4,6]);

// function getMaxVal(w, weights, values) {
//     var dp = new Array(weights.length).fill(new Array(w).fill(0));
//     dp[-1][0] = 0;
//     // 总共5个商品
//     for (var j = 0; j < w; j++) {
//         for (var i = 0; i < weights.length; i++) {
//         // 总共10个重量
//             // 如果i比当前的weight还小，那就根本没法放
//             if (j < weights[i]) {
//                 dp[i][j] = dp[i - 1][j];
//             }
//             else {
//                 dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - weights[i]] + values[i]);
//             }
//         }
//     }
//     return dp[weights.length - 1][w - 1];
// }
// getMaxVal(10, [2,2,6,5,4], [6,3,5,4,6]);

// 0，3，3，6，6
// dp0 = 0;
// dp1 = 0;
// dp2 = 6;

// function knapsack(weights, values, W){
//     var n = weights.length;
//     var f = new Array(W+1).fill(0)
//     for(var i = 0; i < n; i++) {
//         for(var j = W; j >= weights[i]; j--){  
//             f[j] = Math.max(f[j], f[j-weights[i]] +values[i]);
//         }
//         console.log(f.concat()) //调试
//     }
//     return f[W];
// }
// var b = knapsack([2,2,6,5,4],[6,3,5,4,6],10)
// console.log(b)






let startTime = [1,2,3,3]
let endTime = [3,4,5,6];
let profit = [50,10,40,70];


let pre = [0];
function getPre() {
    for(var i = 1; i < len; i++) {
        let preidx = 0;
        while(endTime[i] > ) {
            
        }
    }
}

[1,3];
[2,4];
[3,5];
// let startTime = [1,2,3,3]
// let endTime = [3,4,5,6];
// let profit = [50,10,40,70];
let startTime = [1,2,4,6,3], endTime = [3,5,6,9,10], profit = [20,20,70,60,100];

var jobScheduling = function(startTime, endTime, profit) {
    const jobs = getJobs(startTime, endTime, profit);
    const pre = getPre(jobs);
    let dp = [];
    dp[-1] = 0;
    for(var i = 0; i < jobs.length; i++) {
        dp[i] = Math.max(dp[i-1], dp[pre[i]] + jobs[i][2]);
    }
    return dp[jobs.length - 1];
};

function getJobs(startTime, endTime, profit) {
    let res = [];
    for(i = 0; i < startTime.length; i++) {
        res.push([startTime[i], endTime[i], profit[i]]);
    }
    return res.sort(([s1,e1], [s2,e2]) => e1-e2);
}

function getPre(jobs) {
    let len = jobs.length;
    let cur = 1;
    let pre = cur - 1;
    let res = [-1];
    while(cur < len) {
        if(pre < 0 || jobs[cur][0] >= jobs[pre][1]) {
            res[cur] = pre; 
            pre = cur;
            cur++;
        } else {
            pre--;
        }
    }
    return res;
}

[1,2,3,4,6]
[3,5,10,6,9]
[20,20,100,70,60]



var jobScheduling = function(startTime, endTime, profit) {

    const next = getNext(startTime, endTime);
    var dp = [];
    for(var i = 0; i < profit.length; i++) {
        while(next[i] > 0) {
            dp[i] = dp[i] + dp[next[i]]
        }
    }
    return dp[profit.length - 1];
};

function getNext(startTime, endTime) {
    let len = startTime.length;
    let cur = 0;
    let next = cur + 1;
    let res = [];
    while(cur < len) {
        if(next >= len) {
            res[cur] = -1;
            cur++;
            next = cur + 1;
        }
        else if(endTime[cur] > startTime[next]) {
            next++;
        } else {
            res[cur] = next; 
            cur++;
            next = cur + 1;
        }
    }
    return res;
}