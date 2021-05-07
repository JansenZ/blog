// 合并区间
// 先按照小的排序
// 然后判断左右两边
// 如果左边的高位大与等于右边的低位，合并。
// 如果不大于，右移。
var merge = function(intervals) {
    let res = [];
    // 排序
    let arr = intervals.sort((a, b)=> a[0] - b[0]);

    let x = 0;
    let left = arr[x];
    while(x < arr.length - 1) {
        let right = arr[x + 1];
        // 合并
        if(left[1] >= right[0]) {
            left[1] = Math.max(left[1], right[1]);
        } else {
            res.push(left);
            left = right;
        }
        x++;
    }
    res.push(left);
    return res;
};