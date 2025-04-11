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
  //  1->2->3->null  null<-1 <-2 3->nul
  let pre = null;
  let cur = head;
  while (cur) {
    let nextVal = cur.next;
    cur.next = pre;
    pre = cur;
    cur = nextVal;
  }
  return pre;
};
// @lc code=end
