/*
 * @lc app=leetcode.cn id=215 lang=javascript
 *
 * [215] 数组中的第K个最大元素
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
let findKthLargest = function (nums, k) {
  let heap = [];
  function add(params) {
    if (heap.length < k) {
      heap.push(params);
      up(heap.length - 1);
    } else if (params > heap[0]) {
      heap[0] = params;
      down(0);
    }
  }
  function down(index) {
    let left = index * 2 + 1;
    let right = index * 2 + 2;
    let cur = index;
    if (left < heap.length && heap[left] < heap[cur]) {
      cur = left;
    }
    if (right < heap.length && heap[right] < heap[cur]) {
      cur = right;
    }
    if (cur !== index) {
      [heap[cur], heap[index]] = [heap[index], heap[cur]];
      down(cur);
    }
  }
  function up(index) {
    while (index) {
      let parent = Math.floor((index - 1) / 2);
      if (heap[index] < heap[parent]) {
        [heap[parent], heap[index]] = [heap[index], heap[parent]];
        index = parent;
      } else {
        break;
      }
    }
  }
  for (const element of nums) {
    add(element);
  }
  return heap[0];
};
// @lc code=end
