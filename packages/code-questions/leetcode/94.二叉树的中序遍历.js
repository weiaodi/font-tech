/*
 * @lc app=leetcode.cn id=94 lang=javascript
 *
 * [94] 二叉树的中序遍历
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
 * @return {number[]}
 */
let inorderTraversal = function (root) {
  let result = [];
  let stack = [];
  let cur = root;
  // 1 2>4-5 3
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur.left);
      cur = cur.left;
    }
    cur = stack.pop();
    result.push(cur.val);
    cur = cur.right;
  }
};
// @lc code=end
let inorderTraversal1 = function (root) {
  let result = [];
  if (!root) {
    return result;
  }
  if (root.left) {
    result = result.concat(inorderTraversal1(root.left));
  }
  result.push(root.val);
  if (root.right) {
    result = result.concat(inorderTraversal1(root.right));
  }
  return result;
};
