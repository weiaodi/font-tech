/*
 * @lc app=leetcode.cn id=83 lang=javascript
 *
 * [83] 删除排序链表中的重复元素
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
let deleteDuplicates = function (head) {
  if (!head || !head.next) {
    return head;
  }
  let cur = head;
  while (cur && cur.next) {
    if (cur.val === cur.next.val) {
      cur.next = cur.next.next;
    } else {
      cur = cur.next;
    }
  }
  return head;
};
// @lc code=end
let deleteDuplicates1 = function (head) {
  if (!head || !head.next) {
    return head;
  }
  let fast = head.next,
    slow = head;
  while (fast) {
    if (fast.val !== slow.val) {
      slow.next = fast;
      slow = fast;
    }
    fast = fast.next;
  }
  slow.next = null;
  return head;
};
