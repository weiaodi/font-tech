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
  if (nums.length === 0) {
    return 0;
  }
  //   维护一个 递增数组,遍历原数组,尝试把当前元素放到递增数组中的合适位置
  const ascend = [];
  for (let i = 0; i < nums.length; i++) {
    // 利用二分查找判断 当前元素应该放入的位置
    let left = 0,
      right = ascend.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (nums[i] > ascend[mid]) {
        //   如果当前的元素小于基准值则可以缩小范围,继续查找升序列表中的元素
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    if (left === ascend.length) {
      // 说明升序列表中所有的元素都小于当前元素,则追加到升序列表中
      ascend.push(nums[i]);
    } else {
      // 二分查找的结束情况为left===right 也就是说 left指向在升序列表中第一个大于当前元素的元素
      ascend[left] = nums[i];
    }
  }

  return ascend.length;
};
// @lc code=end
