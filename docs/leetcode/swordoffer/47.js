// 在一个 m*n 的棋盘的每一格都放有一个礼物，每个礼物都有一定的价值（价值大于 0）。你可以从棋盘的左上角开始拿格子里的礼物，并每次向右或者向下移动一格、直到到达棋盘的右下角。给定一个棋盘及其上面的礼物的价值，请计算你最多能拿到多少价值的礼物？

//  

// 示例 1:

// 输入: 
// [
//   [1,3,1],
//   [1,5,1],
//   [4,2,1]
// ]
// 输出: 12
// 解释: 路径 1→3→5→2→1 可以拿到最多价值的礼物

// 0 < grid.length <= 200
// 0 < grid[0].length <= 200

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/li-wu-de-zui-da-jie-zhi-lcof
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

// 这种的就是经典回溯法了吧
// 但是我写回溯水平有限啊。

/**
 * @param {number[][]} grid
 * @return {number}
 */

//  采用递归的方法，爆栈了。
var maxValue = function(grid) {
    let row = grid.length;
    let col = grid[0].length;
    let i = 0, j = 0;
    return getMax(i, j);

    function getMax(i, j) {
        if(i == row || j == col) {
            return 0;
        }
        return grid[i][j] + Math.max(getMax(i, j + 1), getMax(i + 1, j));
    }
};

// 递归的这个之所以爆的快，是因为有大量重复数据点被无限放大的重复请求。
// 所以可以用map来存储，这样的话，空间复杂度还是有点高
var maxValue = function(grid) {
    let row = grid.length;
    let col = grid[0].length;
    let i = 0, j = 0;
    let hash = new Map();
    return getMax(i, j);

    function getMax(i, j) {
        if(hash.has(i + '-' + j)) return hash.get(i + '-' + j);
        if(i == row || j == col) {
            return 0;
        }
        const res = grid[i][j] + Math.max(getMax(i, j + 1), getMax(i + 1, j));
        hash.set(i + '-' + j, res);
        return res;
    }
};


// 动态规划，改用迭代的方式来写。
// 这里其实动态规划的方程和迭代的是一致的
// 但是这里的难点是这两个for循环，我开始竟然都没想对。虽然很接近了。
// 我的这个哨兵个人觉得写的还不错
// 然而空间复杂度略高
// 这里为什么是--的，其实是思维被递归带过去了,看了别人的一维的，写不出来啊。
var maxValue = function(grid) {
    let row = grid.length;
    let col = grid[0].length;
    var dp = new Array(row + 1).fill(new Array(col + 1).fill(0));
    for(var i = row - 1; i >= 0; i --) {
        for(var j = col - 1; j >=0; j--) {
            dp[i][j] = grid[i][j] + Math.max(dp[i][j + 1], dp[i + 1][j]);
        }
    }
    return dp[0][0]
};

// // 所以要想办法改成迭代的方法来回溯
// var maxValue = function(grid) {
//     let row = grid.length;
//     let col = grid[0].length;
//     let i = 0, j = 0;

//     let max = 0;
//     let cur = 0;

//     while(true) {
//         if(i)

//         for(i = 0; i < row.length; i++) {
//             for(j = 0; j < col.length; j++) {
//                 cur = cur + grid[i][j];
//             }
//         }
//     }
//     return max;


//     return getMax(i, j, grid);

//     function getMax(i, j, grid) {
//         if(i == row || j == col) {
//             return 0;
//         }
//         return grid[i][j] + Math.max(getMax(i, j + 1, grid), getMax(i + 1, j, grid));
//     }
// };