/*
 * @lc app=leetcode.cn id=21 lang=javascript
 *
 * [21] 合并两个有序链表
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
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
let mergeTwoLists = function (list1, list2) {
  // eslint-disable-next-line no-undef
  const headNode = new ListNode();
  let pre = headNode;
  while (list1 && list2) {
    if (list1.val > list2.val) {
      pre.next = list2;
      list2 = list2.next;
    } else {
      pre.next = list1;
      list1 = list1.next;
    }
    pre = pre.next;
  }

  pre.next = list1 !== null ? list1 : list2;
  return headNode.next;
};
// @lc code=end
