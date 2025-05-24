/*
 * @lc app=leetcode.cn id=206 lang=javascript
 *
 * [206] 反转链表
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
 * @return {ListNode}
 */
let reverseList = function (head) {
  if (!head || !head.next) {
    return head;
  }
  // eslint-disable-next-line no-undef
  const dummy = new ListNode(null);
  dummy.next = head;
  let cur = head;
  // dummy>2>1>3>null        1>2>3>null
  // dummy>3>2>1>null
  while (cur.next) {
    const next = cur.next;
    cur.next = next.next;
    next.next = dummy.next;
    dummy.next = next;
  }
  return dummy.next;
};
// @lc code=end
let reverseList1 = function (head) {
  if (!head || !head.next) {
    return head;
  }
  let pre = null;
  // null   1>2>3>null   null<1<2<3
  let cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
};
