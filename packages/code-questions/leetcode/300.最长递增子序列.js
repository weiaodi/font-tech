/*
 * @lc app=leetcode.cn id=300 lang=javascript
 *
 * [300] 最长递增子序列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
let lengthOfLIS = function (nums) {
  // 构建一个有序递增数组,通过遍历,采取二分查找将数据填入有序数组中
  let increaseArr = [];
  for (let index = 0; index < nums.length; index++) {
    //  构建左闭右开区间来查询数据
    let left = 0,
      right = increaseArr.length;
    while (left < right) {
      let mid = Math.floor(left + (right - left) / 2);
      if (nums[index] > increaseArr[mid]) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    if (left === increaseArr.length) {
      increaseArr.push(nums[index]);
    } else {
      // [left, right)  而终止条件为  left=right 指明当前元素是大于或者等于 increaseArr[left]中的数据
      increaseArr[left] = nums[index];
    }
  }
  return increaseArr.length;
};
// @lc code=end
