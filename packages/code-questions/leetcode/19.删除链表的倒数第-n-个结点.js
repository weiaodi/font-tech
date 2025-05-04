/*
 * @lc app=leetcode.cn id=19 lang=javascript
 *
 * [19] 删除链表的倒数第 N 个结点
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
 * @param {number} n
 * @return {ListNode}
 */
let removeNthFromEnd = function (head, n) {
  //  头  尾    1-2-3   1-3    cur  pre.next = pre.nenxt.next
  // eslint-disable-next-line no-undef
  const headNode = new ListNode(0, head);
  let slow = headNode,
    fast = head;
  while (n) {
    fast = fast.next;
    n--;
  }

  // 1 2 3 null     1     null 1       3 null
  while (fast) {
    slow = slow.next;
    fast = fast.next;
  }
  slow.next = slow.next.next;
  return headNode.next;
};
// @lc code=end
