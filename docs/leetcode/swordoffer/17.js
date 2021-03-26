// 给定单向链表的头指针和一个要删除的节点的值，定义一个函数删除该节点。
// 返回删除后的链表的头节点。
// 注意：此题对比原题有改动
// 示例 1:
// 输入: head = [4,5,1,9], val = 5
// 输出: [4,1,9]
// 解释: 给定你链表中值为 5 的第二个节点，那么在调用了你的函数之后，该链表应变为 4 -> 1 -> 9.
// 示例 2:

// 输入: head = [4,5,1,9], val = 1
// 输出: [4,5,9]
// 解释: 给定你链表中值为 1 的第三个节点，那么在调用了你的函数之后，该链表应变为 4 -> 5 -> 9.
 
// 说明：

// 题目保证链表中节点的值互不相同
// 若使用 C 或 C++ 语言，你不需要 free 或 delete 被删除的节点

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/shan-chu-lian-biao-de-jie-dian-lcof
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var deleteNode = function(head, val) {

    if(!head) return null;
    if(head.val == val) {
        // 说明只有一个节点，直接删除出null
        if(!head.next) return null
        // 否则head指向q即可
        head = head.next;
    }
    let p = head;
    let q = head.next;
    let deleted = false;
    while(q && !deleted) {
        if(q.val == val) {
            p.next = q.next;
            deleted = true;
        } else {
            // 不相等，后移
            p = q;
            q = q.next;
        }
    }
    return head;
};

// 如果加一个哨兵点的话
var deleteNode = function(head, val) {
    var preNode = new ListNode(null);
    preNode.next = head;
    // 这样的话，上面的那些null的处理其实都解决了
    let p = preNode;
    let q = preNode.next;
    let deleted = 0;
    while(q && !deleted) {
        if(q.val == val) {
            p.next = q.next;
            deleted = 1;
        } else {
            // 不相等，后移
            p = q;
            q = q.next;
        }
    }
    return preNode.next;
};