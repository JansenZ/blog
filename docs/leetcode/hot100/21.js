// 没啥好说的，注意哨兵即可。
var mergeTwoLists = function(l1, l2) {
    let root = new ListNode(-1);
    let hot = root;
    while (l1 && l2) {
        if (l1.val <= l2.val) {
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
};