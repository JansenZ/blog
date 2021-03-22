
// 八皇后就是递归调用
//  分成n行。
// 搜索第0行，然后递归n列
// 然后判断当前row和当前递归的列是否OK
// 如果ok,就给当前row复制当前的col。并搜索下一行

// 判断OK的方法，递归传进来的row长度
// 不能在同一列，也就是arr[i] == col 就会失败
// 对角线就是x+y == i + arr[i] 或者是 x-y == i - arr[i]
// 对角线的数据相加或者相间都是一个值。


var n = 8;
var arr = [];
var total = 0;
var arr2 = [];
function searchQ(row) {
    if (row == n) {
        arr2.push(arr.toString());
        total++;
    }
    for (let col = 0; col < n; col++) {
        if (isValid(row, col)) {
            arr[row] = col;
            searchQ(row + 1);
        }
    }
}

function isValid(row, col) {
    for (let i = 0; i < row; i++) {
        if (arr[i] == col || col + row == arr[i] + i || col - row == arr[i] - i) {
            return false;
        }
    }
    return true;
}

searchQ(0);
console.log(total);
console.log(arr2);













var maxW = 0;
var weight = [3,8,4,6,7];  // 物品重量
var n = 5; // 物品个数
var w = 9; // 背包承受的最大重量
var arr = [];
function f(i, cw) { // 调用f(0, 0)
  if (cw == w || i == n) { // cw==w表示装满了，i==n表示物品都考察完了
    if (cw > maxW) maxW = cw;
    return;
  }
  f(i+1, cw); // 选择不装第i个物品
  if (cw + weight[i] <= w) {
    f(i+1,cw + weight[i]); // 选择装第i个物品
  }
}
f(0,0)
console.log(maxW);
console.log(arr);