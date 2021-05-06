// 两两合并，利用归并排序的那个东西，然后合并。
// 单合并算法和两个合并那题一样

var mergeKLists = function (lists) {
    if(!lists.length) return null;
    return mergeSort(lists, 0, lists.length - 1);
};

function mergeSort(list, start, end) {
    if (start == end) return list[start];
    let mid = (start + end) >> 1;
    return merge(mergeSort(list, start, mid), mergeSort(list, mid + 1, end));
}

function merge(l1, l2) {
    let root = new ListNode(-1);
    let hot = root;
    while (l1 && l2) {
        if (l1.val < l2.val) {
            hot.next = l1;
            l1 = l1.next;
        } else {
            hot.next = l2;
            l2 = l2.next;
        }
        hot = hot.next;
    }
    hot.next = l1 ? l1 : l2;
    return root.next;
}