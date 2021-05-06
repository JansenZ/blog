// 也没啥好说的，类似大数相加那题
// medium
var addTwoNumbers = function(l1, l2) {
    let newHead = new ListNode(-1);
    let myL = newHead;
    let flag = 0;
    while(l1 || l2 || flag) {
        let l1v = l1 ? l1.val : 0;
        let l2v = l2 ? l2.val : 0;
        flag += l1v + l2v;

        myL.next = new ListNode(flag % 10);

        flag = ~~(flag >= 10);
        l1 = l1 ? l1.next : null;
        l2 = l2 ? l2.next : null;
        myL = myL.next;
    }
    return newHead.next;
};