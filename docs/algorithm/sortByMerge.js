// 归并排序 O(nlogn)
// 归并排序实际上就是拆分数组，从中间拆，直到都只剩下一个为止
// 然后拆分下来的左右最小单位，依次往上比较排序。最后到了顶层就排完了。

// 算法记忆
// 首先，拆分左右数组。其次，最后return的时候，给左右数组包装一个merge函数。
// merge函数里while左右数组的length都大于0的时候，
// 判断左右数组第一个位置谁小，谁小就shift掉给临时数组。
// 最后，当任何一方length为0的时候，说明另外一方还有值在数组里。
// 临时数组最后还要concat左右。拼成完整的链条。
var arr = [5, 6, 3, 1, 8, 7, 2, 4];
function sortByMerge(arr) {
    if(arr.length == 1) {
        return arr;
    }
    const midIdx = arr.length >> 2;
    const leftArr = arr.slice(0, midIdx);
    const rightArr = arr.slice(midIdx);
    return mergeFn(sortByMerge(leftArr), sortByMerge(rightArr));
}
function mergeFn(left, right) {
    let res = [];
    while(left.length && right.length) {
        left[0] < right[0] ? res.push(left.shift()) : res.push(right.shift());
    }
    res = res.concat(left, right);
    return res;
}
