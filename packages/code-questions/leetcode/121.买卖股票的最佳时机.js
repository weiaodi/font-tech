/*
 * @lc app=leetcode.cn id=121 lang=javascript
 *
 * [121] 买卖股票的最佳时机
 */

// @lc code=start
/**
 * @param {number[]} prices
 * @return {number}
 */
let maxProfit = function (prices) {
  let profit = 0;
  let min = prices[0];
  for (const price of prices) {
    min = Math.min(min, price);
    profit = Math.max(profit, price - min);
  }
  return profit;
};
// @lc code=end
