
// 输入两个链表，找出它们的第一个公共节点。

// 如下面的两个链表：



// 在节点 c1 开始相交。

//  

// 示例 1：



// 输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,0,1,8,4,5], skipA = 2, skipB = 3
// 输出：Reference of the node with value = 8
// 输入解释：相交节点的值为 8 （注意，如果两个列表相交则不能为 0）。从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,0,1,8,4,5]。在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。
//  

// 示例 2：



// 输入：intersectVal = 2, listA = [0,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
// 输出：Reference of the node with value = 2
// 输入解释：相交节点的值为 2 （注意，如果两个列表相交则不能为 0）。从各自的表头开始算起，链表 A 为 [0,9,1,2,4]，链表 B 为 [3,2,4]。在 A 中，相交节点前有 3 个节点；在 B 中，相交节点前有 1 个节点。
//  

// 示例 3：



// 输入：intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
// 输出：null
// 输入解释：从各自的表头开始算起，链表 A 为 [2,6,4]，链表 B 为 [1,5]。由于这两个链表不相交，所以 intersectVal 必须为 0，而 skipA 和 skipB 可以是任意值。
// 解释：这两个链表不相交，因此返回 null。
//  

// 注意：

// 如果两个链表没有交点，返回 null.
// 在返回结果后，两个链表仍须保持原有的结构。
// 可假定整个链表结构中没有循环。
// 程序尽量满足 O(n) 时间复杂度，且仅用 O(1) 内存。
// 本题与主站 160 题相同：https://leetcode-cn.com/problems/intersection-of-two-linked-lists/

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/liang-ge-lian-biao-de-di-yi-ge-gong-gong-jie-dian-lcof
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。




// 这题目肯定不能用暴力解法和hash算法
// 暴力解法就是o m* n
// hash算法空间复杂度会有o n

// 需要用到快慢指针，找到两个节点的长度差，然后将长的那个链表，移动长度差个位置，然后一次一次移动，这样如果相同的话，就一定会相遇。
// 这样的话，最终不超过 O 2n ，也就是On
// 这个规律需要稍微看过题，不然干想有可能是想不出来的
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