import { TreeNode } from './tree-node.js';

export class BinaryTree {
  root;
  constructor(root = null) {
    this.root = root;
  }
  preOrder() {
    let result = [];
    function traverseNode(node) {
      if (node) {
        result.push(node.value);
        traverseNode(node.left);
        traverseNode(node.right);
      }
    }
    traverseNode(this.root);
    return result;
  }
  inOrder() {
    let result = [];
    function traverseNode(node) {
      if (node) {
        traverseNode(node.left);
        result.push(node.value);
        traverseNode(node.right);
      }
    }
    traverseNode(this.root);
    return result;
  }
  postOrder() {
    let result = [];
    function traverseNode(node) {
      if (node) {
        traverseNode(node.left);
        traverseNode(node.right);
        result.push(node.value);
      }
    }
    traverseNode(this.root);
    return result;
  }
  levelOrder() {
    let result = [];
    if (!this.root) {
      return result;
    }
    let queue = [];
    queue.push(this.root);
    while (queue.length > 0) {
      let node = queue.shift();
      result.push(node.value);
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
    return result;
  }
}

// 示例用法
const demo = () => {
  const root = new TreeNode(1);
  root.left = new TreeNode(2);
  root.right = new TreeNode(3);
  root.left.left = new TreeNode(4);
  root.left.right = new TreeNode(5);
  /*
          1
         / \
        2   3
       / \
      4   5
  */
  const binaryTree = new BinaryTree(root);
  console.log('🚀 ~ root:', root);

  console.log('前序遍历:', binaryTree.preOrder());
  console.log('中序遍历:', binaryTree.inOrder());
  console.log('后序遍历:', binaryTree.postOrder());
  console.log('层序遍历:', binaryTree.levelOrder());
};
// demo();
