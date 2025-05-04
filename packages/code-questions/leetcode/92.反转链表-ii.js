/*
 * @lc app=leetcode.cn id=92 lang=javascript
 *
 * [92] 反转链表 II
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
let reverseBetween = function (head, left, right) {
  if (!head || !head.next || left === right) {
    return head;
  }
  // eslint-disable-next-line no-undef
  const headNode = new ListNode();
  headNode.next = head;
  let pre = headNode;
  let cur = head;
  let step = left - 1;
  while (step) {
    pre = pre.next;
    step--;
  }
  cur = pre.next;
  for (let i = 0; i < right - left; i++) {
    const next = cur.next;
    cur.next = next.next;
    next.next = pre.next;
    pre.next = next;
  }
  return headNode.next;
};
// @lc code=end
