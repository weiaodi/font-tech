/*
 * @lc app=leetcode.cn id=203 lang=javascript
 *
 * [203] 移除链表元素
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
 * @param {number} val
 * @return {ListNode}
 */
let removeElements = function (head, val) {
  if (!head) {
    return head;
  }
  // eslint-disable-next-line no-undef
  const dummy = new ListNode();
  dummy.next = head;
  let pre = dummy;
  let cur = head;
  while (cur) {
    if (cur.val === val) {
      pre.next = cur.next;
      cur = cur.next;
    } else {
      pre = pre.next;
      cur = cur.next;
    }
  }
  return dummy.next;
};
// @lc code=end
