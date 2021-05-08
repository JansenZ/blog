/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
// 之前的思路是跑完AB节点，然后拿到两个人的长度，获取长度差，然后让长的那个节点，跑完这个长度差。
// 然后一起移动，最后相交就返回node
// 这个好像其实也是o2n

// 换一个思路就是AB跑完后，就偶从BA开始跑，这样也一定会相遇
// https://leetcode-cn.com/problems/intersection-of-two-linked-lists/solution/javascriptxiang-jiao-lian-biao-tu-jie-shuang-zhi-z/
// 但是这个写法容易的多的多啊


// 解法1
var getIntersectionNode = function(headA, headB) {
    let node1 = headA;
    let node2 = headB;
    let len1 = 0, len2 = 0;
    while (node1) {
        len1++;
        node1 = node1.next;
    }
    while (node2) {
        len2++;
        node2 = node2.next;
    }
    let dif = Math.abs(len1 - len2);
    // 重置
    node1 = headA;
    node2 = headB;
    let node = len1 > len2 ? headA : headB;
    while (dif) {
        node = node.next;
        dif--;
    }

    if (len1 > len2) {
        node1 = node;
    } else {
        node2 = node;
    }

    while (node1) {
        if (node1 == node2) return node1;
        node1 = node1.next;
        node2 = node2.next;
    }
    return null;
};

// 解法2
var getIntersectionNode = function(headA, headB) {
    let node1 = headA;
    let node2 = headB;
    
    while(node1 || node2) {
        if(node1 == node2) return node1;
        node1 = node1 ? node1.next : headB;
        node2 = node2 ? node2.next : headA;
    }
    return null;
};