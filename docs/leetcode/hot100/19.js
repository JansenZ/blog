// 删除倒数第N个结点
var removeNthFromEnd = function(head, n) {
    let fastNode = head;
    let slowNode = head;
    let preNode = head;
    while(n) {
        fastNode = fastNode.next;
        n--;
    }
    while(fastNode) {
        preNode = slowNode;
        slowNode = slowNode.next;
        fastNode = fastNode.next;
    }
    if(slowNode == head) return head.next;
    preNode.next = slowNode.next;
    return head;
};