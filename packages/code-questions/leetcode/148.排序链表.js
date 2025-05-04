/*
 * @lc app=leetcode.cn id=148 lang=javascript
 *
 * [148] 排序链表
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
let sortList = function (head) {
  function getMiddle(head) {
    let slow = head;
    let fast = head.next;
    while (fast && fast.next) {
      fast = fast.next.next;
      slow = slow.next;
    }
    const middle = slow.next;
    slow.next = null;
    return middle;
  }
  function merge(left, right) {
    // eslint-disable-next-line no-undef
    const dummy = new ListNode();
    let cur = dummy;
    while (left && right) {
      if (left.val > right.val) {
        cur.next = right;
        right = right.next;
      } else {
        cur.next = left;
        left = left.next;
      }
      cur = cur.next;
    }
    cur.next = left === null ? right : left;
    return dummy.next;
  }
  function mergeSort(head) {
    if (!head || !head.next) {
      return head;
    }
    const middle = getMiddle(head);
    // 1234    12  34
    const left = mergeSort(head);
    const right = mergeSort(middle);
    return merge(left, right);
  }
  return mergeSort(head);
};

// @lc code=end
