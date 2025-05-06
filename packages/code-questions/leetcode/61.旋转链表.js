/*
 * @lc app=leetcode.cn id=61 lang=javascript
 *
 * [61] 旋转链表
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
 * @param {number} k
 * @return {ListNode}
 */
let rotateRight = function (head, k) {
  if (!head || !head.next) {
    return head;
  }
  // k%count
  let count = 0;
  let cur = head;
  // eslint-disable-next-line no-undef
  const dummy = new ListNode(0, head);
  let pre = dummy;
  while (cur) {
    pre = pre.next;
    cur = cur.next;
    count++;
  }
  // 12345   45123
  let rest = count - (k % count);
  if (rest === count) {
    return head;
  }
  let curMove = head;
  let end = pre;
  while (rest) {
    const next = curMove.next;
    dummy.next = next;
    // null 1234   2341
    curMove.next = null;
    //
    end.next = curMove;
    end = curMove;
    curMove = next;
    rest--;
  }
  return dummy.next;
};
// @lc code=end
