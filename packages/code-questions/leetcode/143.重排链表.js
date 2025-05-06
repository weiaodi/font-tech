/*
 * @lc app=leetcode.cn id=143 lang=javascript
 *
 * [143] 重排链表
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
 * @return {void} Do not return anything, modify head in-place instead.
 */
let reorderList = function (head) {
  if (!head || !head.next) {
    return head;
  }
  //
  let slow = head,
    fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  let cur = slow.next;
  slow.next = null;
  let prev = null;

  while (cur) {
    let next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  //
  let curHead = head;
  let curReverse = prev;
  while (curHead && curReverse) {
    // 123    654
    // 1623
    const next = curHead.next;
    curHead.next = curReverse;
    const reverseNext = curReverse.next;
    curReverse.next = next;
    curHead = next;
    curReverse = reverseNext;
  }
};
// @lc code=end
