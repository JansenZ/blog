// https://leetcode-cn.com/problems/linked-list-cycle-ii/
// 经典找还

// 给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。

// 为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。注意，pos 仅仅是用于标识环的情况，并不会作为参数传递到函数中。

// 说明：不允许修改给定的链表。

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/linked-list-cycle-ii
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。


// 解析1 https://leetcode-cn.com/problems/linked-list-cycle-ii/solution/linked-list-cycle-ii-kuai-man-zhi-zhen-shuang-zhi-/
// 解析2 https://leetcode-cn.com/problems/linked-list-cycle-ii/solution/huan-xing-lian-biao-ii-by-leetcode-solution/

/*
    假设这个链表是 a + b 长度
    其中，第一次相遇的时候， 肯定在b里相遇，那么相遇前的段落叫 s1, 相遇后的叫 s2
    快指针一次走2步，慢指针走一步
    所以 2 * (a + s1) = a + n(s1 + s2) + s1
    所以 2a + 2s1 = a + (n + 1)s1 + ns2
    所以 a = (n - 1)s1 + ns2
    所以 a = (n-1)(s1 + s2) + s2;
    所以 a = (n-1)(b) + s2
    那么n是多少圈，无所谓，因为a只要够长，最后两个人相遇的时候，一定是跑完这个a，也就是在同一个位子相遇
    假设n = 1，那就是 a = s2；
    所以第一次相遇后，每人一次走一步，快指针重置为0即可。这样第二次相遇的时候，返回那个节点就是答案。
*/

var detectCycle = function(head) {
    if(head == null) return null;
    let fast = head;
    let slow = head;
    while(fast !== null) {
        slow = slow.next;
        if(fast.next) {
            fast = fast.next.next
        } else {
            return null;
        }
        // 第一次相遇
        if(slow == fast) {
            let fast = head;
            // 找到第二次相遇
            while(slow !== fast) {
                slow = slow.next;
                fast = fast.next
            }
            return fast;
        }
    }
    return null;
}