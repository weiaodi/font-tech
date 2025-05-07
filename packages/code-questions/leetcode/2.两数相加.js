/*
 * @lc app=leetcode.cn id=2 lang=javascript
 *
 * [2] 两数相加
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
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
let addTwoNumbers = function (l1, l2) {
  //
  // eslint-disable-next-line no-undef
  const dummy = new ListNode(0);
  let cur = dummy;
  let carry = 0;
  let sum = 0;
  while (l1 || l2 || sum > 0) {
    if (l1 !== null) {
      sum += l1.val;
      l1 = l1.next;
    }
    if (l2 !== null) {
      sum += l2.val;
      l2 = l2.next;
    }
    if (sum >= 10) {
      sum -= 10;
      carry = 1;
    }
    // eslint-disable-next-line no-undef
    cur.next = new ListNode(sum);
    cur = cur.next;
    // 下一次的和
    sum = carry;
    carry = 0;
  }
  return dummy.next;
};
// @lc code=end
