// 输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。
// 示例 1：
// 输入：head = [1,3,2]
// 输出：[2,3,1]
//  
// 限制：
// 0 <= 链表长度 <= 10000
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {number[]}
 */
var reversePrint = function(head) {
    let left = head;
    let right = head.next;
    let temp;
    head.next = null;

    while(right) {
        temp = right.next;
        right.next = left;
        left = right;
        right = temp;
    }
    return left;
};


var reversePrint = function(head) {
    let left = head;
    if(!left) {
        return [];
    }
    let right = head.next;
    if(!right) {
        return [left.val];
    }
    head.next = null;

    var arr = [];

    function fanzhuan(left, right) {
        if(!right.next) {
            right.next = left;
        }
        else {
            const node = fanzhuan(right, right.next);
            node.next = left;
        }
        arr.push(right.val);
        if(!left.next) {
            arr.push(left.val);
        }
        return left;
    }

    fanzhuan(left, right);

    return arr;
};


// 看起来写复杂了，要么直接unshift，要吗就反转链表后直接打印