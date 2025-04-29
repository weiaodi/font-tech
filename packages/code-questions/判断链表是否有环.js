// 定义链表节点类
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function hasCycle(head) {
  // 注意初始值和特定数值的判断
  if (!head || !head.next) {
    return false;
  }
  let slow = head;
  let fast = head.next;
  while (fast !== null) {
    if (fast === slow) {
      return true;
    }
    if (!fast.next && !fast.next.next) {
      return false;
    }
    slow = slow.next;
    fast = fast.next.next;
  }
  return false;
}

// 测试示例
// 创建链表 1 -> 2 -> 3 -> 4 -> 5 （无环）
const node1 = new ListNode(1);
const node2 = new ListNode(2);
const node3 = new ListNode(3);
const node4 = new ListNode(4);
const node5 = new ListNode(5);
node1.next = node2;
node2.next = node3;
node3.next = node4;
node4.next = node5;
console.log(hasCycle(node1)); // 输出 false

// 创建链表 1 -> 2 -> 3 -> 4 -> 5 （有环，5 指向 3）
const node6 = new ListNode(1);
const node7 = new ListNode(2);
const node8 = new ListNode(3);
const node9 = new ListNode(4);
const node10 = new ListNode(5);
node6.next = node7;
node7.next = node8;
node8.next = node9;
node9.next = node10;
node10.next = node8;
console.log(hasCycle(node6)); // 输出 true
