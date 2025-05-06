/*
 * @lc app=leetcode.cn id=25 lang=javascript
 *
 * [25] K 个一组翻转链表
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
let reverseKGroup = function (head, k) {
  // 创建虚拟头节点，方便处理链表连接
  // eslint-disable-next-line no-undef
  let dummy = new ListNode(0);
  dummy.next = head;
  let prev = dummy;

  // 统计链表长度
  let length = 0;
  let temp = head;
  while (temp) {
    length++;
    temp = temp.next;
  }

  // 逐步反转每组k个节点
  while (length >= k) {
    let curr = prev.next;
    let next = curr.next;
    for (let i = 1; i < k; i++) {
      curr.next = next.next;
      next.next = prev.next;
      prev.next = next;
      next = curr.next;
    }
    // 移动指针到下一组
    prev = curr;
    length -= k;
  }

  return dummy.next;
};
// @lc code=end
