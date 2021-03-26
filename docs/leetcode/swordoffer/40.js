// 找出最小的k个数
// 低端方式就用自带的sort方法，然后截取前k个数

// 使用小顶堆的方式？
// 使用快排的方式？
// 基本就是上述三种方式

// 低端方法
var getLeastNumbers = function(arr, k) {
    return arr.sort((a,b) => a-b).slice(0, k);
};
// 快排方法
var getLeastNumbers = function(arr, k) {
    return quicksort(arr).slice(0, k);
};

function quicksort(arr) {
    let len = arr.length;
    if(!arr.length) return [];
    if(len == 1) return arr;
    let mid = Math.floor(len / 2);
    let cval = arr.splice(mid, 1)[0];
    let leftArr = [], rightArr = [];
    for(var i = 0; i < arr.length; i ++) {
        if(arr[i] < cval) {
            leftArr.push(arr[i])
        } else {
            rightArr.push(arr[i]);
        }
    }
    return quicksort(leftArr).concat(cval, quicksort(rightArr));
}

// 小顶堆
// 小顶堆和大顶堆的区别就是swap的时候大小不一样，以及rebuild的时候一个是找最大换，一个是找最小换。
var getLeastNumbers = function(arr, k) {
    var heap = new Heap(arr);
    var arr = [];
    for(var i = 0; i < k; i ++) {
        arr.push(heap.top());
        heap.deleteMax();
    }
    return arr;
};

// 小顶堆，top返回最小值
class Heap {
    constructor(arr) {
        this.arr = arr;
        this.len = arr.length;
        this.min = Math.floor(this.len / 2) - 1;
        this.init();
    }

    init() {
        let i = this.min;
        while (i >= 0) {
            this.rebuild(i);
            i --;
        }
    }
    rebuild(i) {
        // 说明已经交换到叶子节点了，不用往下了
        if(i > this.min) return;
        let lc = i * 2 + 1;
        let rc = (i + 1) * 2;
        if(rc && this.arr[lc] > this.arr[rc]) {
            this.swap(i, (i + 1) * 2);
        } else {
            this.swap(i, i * 2 + 1);
        }
    }

    swap(parent, child) {
        if(this.arr[parent] > this.arr[child]) {
            [this.arr[parent], this.arr[child]] = [this.arr[child], this.arr[parent]];
            this.rebuild(child);
        }
    }

    top() {
        return this.arr[0];
    }

    deleteRoot() {
        // 交换
        [this.arr[0], this.arr[this.len - 1]] = [this.arr[this.len - 1], this.arr[0]];
        this.arr.pop();
        this.rebuild(0);
        this.len --;
    }
}