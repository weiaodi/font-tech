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
  const add = (item) => {
    if (heap.length < k) {
      heap.push(item);
      heapUp(heap.length - 1);
    } else if (item > heap[0]) {
      heap[0] = item;
      heapDown(0);
    }
  };

  const heapUp = (index) => {
    while (index > 0) {
      let parent = Math.floor((index - 1) / 2);
      if (heap[index] < heap[parent]) {
        [heap[parent], heap[index]] = [heap[index], heap[parent]];
        index = parent;
      } else {
        break;
      }
    }
  };

  const heapDown = (index) => {
    // 先判断是否大于左右节点,左右节点是否越级
    while (true) {
      let min = index;
      let left = index * 2 + 1;
      let right = index * 2 + 2;
      if (left < heap.length && heap[min] > heap[left]) {
        min = left;
      }
      if (right < heap.length && heap[min] > heap[right]) {
        min = right;
      }
      if (min !== index) {
        [heap[min], heap[index]] = [heap[index], heap[min]];
        index = min;
      } else {
        //
        break;
      }
    }
  };

  for (const element of nums) {
    add(element);
  }
  return heap[0];
};
// @lc code=end
