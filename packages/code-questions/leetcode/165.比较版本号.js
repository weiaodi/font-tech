/*
 * @lc app=leetcode.cn id=165 lang=javascript
 *
 * [165] 比较版本号
 */

// @lc code=start
/**
 * @param {string} version1
 * @param {string} version2
 * @return {number}
 */
let compareVersion = function (version1, version2) {
  //  获取修订号列表 去除前导0
  let reversion1 = version1.split('.').map((item) => {
    return parseInt(item.replace(/^0+/, '') || '0');
  });

  let reversion2 = version2.split('.').map((item) => {
    return parseInt(item.replace(/^0+/, '') || '0');
  });

  // 逐个比较修订号信息
  let cur = 0;
  while (cur < reversion1.length && cur < reversion2.length) {
    if (reversion1[cur] > reversion2[cur]) {
      return 1;
    }

    if (reversion1[cur] < reversion2[cur]) {
      return -1;
    }
    cur++;
  }

  if (reversion1.length === reversion2.length) {
    return 0;
  }

  if (reversion1.length > reversion2.length) {
    while (cur < reversion1.length) {
      if (reversion1[cur] !== 0) {
        return 1;
      }
      cur++;
    }
    return 0;
  }

  if (reversion1.length < reversion2.length) {
    while (cur < reversion2.length) {
      if (reversion2[cur] !== 0) {
        return -1;
      }
      cur++;
    }
    return 0;
  }
};
// @lc code=end
// 补齐0就行
let compareVersion1 = function (version1, version2) {
  const v1 = version1.split('.').map(Number);
  const v2 = version2.split('.').map(Number);
  const maxLen = Math.max(v1.length, v2.length);

  for (let i = 0; i < maxLen; i++) {
    const num1 = i < v1.length ? v1[i] : 0;
    const num2 = i < v2.length ? v2[i] : 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
};
