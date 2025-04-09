/*
 * @lc app=leetcode.cn id=4 lang=javascript
 *
 * [4] 寻找两个正序数组的中位数
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
let findMedianSortedArrays = function (nums1, nums2) {
  let mergedArr = [];
  // 合并数组
  let n1 = 0,
    n2 = 0;
  while (n1 < nums1.length && n2 < nums2.length) {
    if (nums1[n1] < nums2[n2]) {
      mergedArr.push(nums1[n1]);
      n1++;
    } else {
      mergedArr.push(nums2[n2]);
      n2++;
    }
  }
  while (n1 < nums1.length) {
    mergedArr.push(nums1[n1]);
    n1++;
  }
  while (n2 < nums2.length) {
    mergedArr.push(nums2[n2]);
    n2++;
  }
  if (mergedArr.length % 2 === 0) {
    return (mergedArr[mergedArr.length / 2] + mergedArr[mergedArr.length / 2 - 1]) / 2;
  }
  return mergedArr[Math.floor(mergedArr.length / 2)];
};
// @lc code=end
