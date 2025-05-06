/*
 * @lc app=leetcode.cn id=33 lang=javascript
 *
 * [33] 搜索旋转排序数组
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
let search = function (nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    // 找到目标值
    if (nums[mid] === target) {
      return mid;
    }
    // 判断左半部分是否有序
    if (nums[left] <= nums[mid]) {
      // 如果 target 在左半部分的范围内
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1; // 缩小到左半部分
      } else {
        left = mid + 1; // 否则缩小到右半部分
      }
    }
    // 否则右半部分有序
    else if (nums[mid] < target && target <= nums[right]) {
      left = mid + 1; // 缩小到右半部分
    } else {
      right = mid - 1; // 否则缩小到左半部分
    }
  }
  return -1;
};
// @lc code=end
