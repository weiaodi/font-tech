/*
 * @lc app=leetcode.cn id=560 lang=javascript
 *
 * [560] 和为 K 的子数组
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
let subarraySum = function (nums, k) {
  /**
   * 根据题意转化有 sum[i]-sum[j]=k 则 sum[i]-k=sum[j]
   * 思路: 记录sum[j]存在的情况,遍历数组,找寻sum[i]-k=sum[j]成立条件出现的次数
   */
  let count = 0;
  let preSum = [nums[0]];
  let hashResult = {};
  hashResult[0] = 1;
  for (let i = 0; i < nums.length; i++) {
    if (i > 0) {
      // 计算当前前缀和
      preSum[i] = preSum[i - 1] + nums[i];
    }
    // 先判断是否存在有sum[i]-k=sum[j]的情况,再存储前缀和的结果
    if (hashResult[preSum[i] - k]) {
      count += hashResult[preSum[i] - k];
    }
    // 记录前缀和出现的情况
    if (hashResult[preSum[i]]) {
      hashResult[preSum[i]]++;
    } else {
      hashResult[preSum[i]] = 1;
    }
  }
  return count;
};

// @lc code=end
let subarraySum1 = (nums, k) => {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum === k) {
        count++;
      }
    }
  }
  return count;
};
