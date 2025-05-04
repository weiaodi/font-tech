/*
 * @lc app=leetcode.cn id=82 lang=javascript
 *
 * [82] 删除排序链表中的重复元素 II
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

  // eslint-disable-next-line no-undef
  const headNode = new ListNode();
  headNode.next = head;
  let pre = headNode;

  let fast = head.next,
    slow = head;
  while (fast) {
    if (fast.val === slow.val) {
      // 122345     1   22   134
      while (fast && slow.val === fast.val) {
        fast = fast.next;
      }
      pre.next = fast;
      slow = fast;
      if (fast) {
        fast = fast.next;
      }
    } else {
      fast = fast.next;
      slow = slow.next;
      pre = pre.next;
    }
  }

  return headNode.next;
};
// @lc code=end
