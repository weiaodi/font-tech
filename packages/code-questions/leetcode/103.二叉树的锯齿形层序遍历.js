/*
 * @lc app=leetcode.cn id=103 lang=javascript
 *
 * [103] 二叉树的锯齿形层序遍历
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
let zigzagLevelOrder = function (root) {
  if (!root) {
    return [];
  }
  let res = [];
  let queue = [root];
  let LeftToRight = true;
  while (queue.length) {
    let levelNode = [];
    let len = queue.length;
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
      if (LeftToRight) {
        levelNode.push(node.val);
      } else {
        levelNode.unshift(node.val);
      }
    }
    LeftToRight = !LeftToRight;
    res.push(levelNode);
  }

  return res;
};
// @lc code=end
