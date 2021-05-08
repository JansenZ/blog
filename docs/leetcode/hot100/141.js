// 经典快慢指针。
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
    if(!head) return false;

    let slow = head;
    let fast = head;

    while(fast) {
        // 防止就一个还带环的。所以得写里面，不能while(fast.next)
        if(!fast.next) return false;
        slow = slow.next;
        fast = fast.next.next;
        if(slow == fast) return true;
    }
    return false;
};