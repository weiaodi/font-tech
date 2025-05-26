/*
 * @lc app=leetcode.cn id=147 lang=javascript
 *
 * [147] 对链表进行插入排序
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
let insertionSortList = function (head) {
  if (!head || !head.next) {
    return head;
  }
  // eslint-disable-next-line no-undef
  const dummy = new ListNode(0, head);
  let cur = head.next;
  let sorted = head;
  while (cur) {
    if (cur.val >= sorted.val) {
      sorted = sorted.next;
    } else {
      let pre = dummy;
      while (pre.next.val <= cur.val) {
        pre = pre.next;
      }
      // 1246/37
      sorted.next = cur.next;
      const next = pre.next;
      pre.next = cur;
      cur.next = next;
    }
    cur = sorted.next;
  }
  return dummy.next;
};

// @lc code=end
