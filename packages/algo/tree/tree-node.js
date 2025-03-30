export class TreeNode {
  value;
  left;
  right;
  constructor(value, left, right) {
    this.value = value === undefined ? 0 : value;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}
