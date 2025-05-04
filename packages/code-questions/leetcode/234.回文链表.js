/*
 * @lc app=leetcode.cn id=234 lang=javascript
 *
 * [234] 回文链表
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
 * @return {boolean}
 */
let isPalindrome = function (head) {
  if (!head.next || !head) {
    return true;
  }
  // 123  2    1234    11    13 24
  let slow = head,
    fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  const pre = slow;
  let cur = slow.next;
  while (cur.next) {
    // pre1 2 3 4 5 6
    // pre1 -> 3->2->4->5->6      curnext 4  prenext 3
    // cur2  pre1
    // pre1->4->3->2->5
    const temp = cur.next;
    cur.next = temp.next;
    temp.next = pre.next;
    pre.next = temp;
  }
  slow = head;
  fast = pre.next;
  while (fast) {
    if (fast.val === slow.val) {
      fast = fast.next;
      slow = slow.next;
    } else {
      return false;
    }
  }
  return true;
  //
};
// @lc code=end
