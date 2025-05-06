class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseBetween(head, left, right) {
  if (!head || !head.next || left === right) {
    return head;
  }
  //   12345
  let step = left - 1;
  let dummy = new ListNode();
  dummy.next = head;
  let pre = dummy;
  while (step) {
    pre = pre.next;
    step--;
  }
  //
  let cur = pre.next;
  for (let i = 0; i < right - left; i++) {
    const next = cur.next;
    cur.next = next.next;
    next.next = pre.next;
    pre.next = next;
  }
  return dummy.next;
}

function reverseBetween1(head, left, right) {
  if (!head || !head.next || left === right) {
    return head;
  }
  let step = left - 1;
  let dummy = new ListNode();
  dummy.next = head;
  let pre = dummy;
  while (step) {
    pre = pre.next;
    step--;
  }
  let prev = null;
  let start = pre.next;
  let cur = pre.next;
  // 反转从 left 到 right 的节点，反转次数为 right - left + 1
  for (let index = 0; index <= right - left; index++) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  // 连接反转部分和原链表
  pre.next = prev;
  start.next = cur;
  return dummy.next;
}

// 辅助函数：将数组转换为链表
function arrayToList(arr) {
  if (arr.length === 0) return null;
  let head = new ListNode(arr[0]);
  let current = head;
  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }
  return head;
}

// 辅助函数：将链表转换为数组
function listToArray(head) {
  const result = [];
  let current = head;
  while (current) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

// 测试代码
const arr = [1, 2, 3, 4, 5];
const head = arrayToList(arr);
const arr1 = [1, 2, 3, 4, 5];
const head1 = arrayToList(arr1);
const left = 2;
const right = 4;
const reversedHead = reverseBetween(head, left, right);
const reversedArray = listToArray(reversedHead);
const reversedHead1 = reverseBetween1(head1, left, right);
const reversedArray1 = listToArray(reversedHead1);
console.log(reversedArray, reversedArray1);
