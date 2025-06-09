import { BinaryTree } from './binary-tree.js';
import { TreeNode } from './tree-node.js';

class BinarySearchTree extends BinaryTree {
  search(target) {
    let cur = this.root;
    while (cur !== null) {
      if (cur.value > target) {
        cur = cur.left;
      } else if (cur.value < target) {
        cur = cur.right;
      }
      // 找到目标节点，跳出循环
      else break;
    }
    return cur;
  }
  //   二叉搜索树不允许存在重复节点
  insert(target) {
    if (this.root === null) {
      this.root = new TreeNode(target);
    }
    let cur = this.root,
      pre = null;
    while (cur !== null) {
      // 找到重复节点返回
      if (cur.value === target) {
        return;
      }
      pre = cur;
      if (cur.value > target) {
        cur = cur.left;
      } else if (cur.value < target) {
        cur = cur.right;
      }
    }
    let node = new TreeNode(target);
    if (pre.value > target) {
      pre.left = node;
    } else {
      pre.right = node;
    }
  }
  remove(target) {
    /**
     * 1.找到待删除节点
     * 2.讨论删除情况分为
     *  1.该节点无子节点, 直接删除
     *  2.该节点只有一个子节点,将需要删除的节点替换为他的子节点就行
     *  3.该节点含有两个子节点.由于要保持二叉搜索树“左子树<根节点<右子树”的性质，因此这个节点可以是右子树的最小节点或左子树的最大节点。
     */
    if (this.root === null) {
      return;
    }
    let cur = this.root,
      pre = null;
    while (cur !== null) {
      pre = cur;
      if (cur.value > target) {
        cur = cur.left;
      } else if (cur.value < target) {
        cur = cur.right;
      } else break;
    }
    if (cur === null) {
      return;
    }
    if (cur.left === null || cur.right === null) {
      // 子节点为0|1的情况
      let child = cur.left === null ? cur.right : cur.left;
      // 判断是否为根节点,如果不是,则把要删除的节点替换为他的子节点
      if (cur !== this.root) {
        if (pre.left !== null) {
          pre.left = child;
        } else {
          pre.right = child;
        }
      } else {
        // 根节点不含子节点和根节点含有一个子节点的情况
        this.root = child;
      }
    } else {
      // 子节点为2的情况,找寻右子树的最小子节点
      let tempNode = cur.right;
      while (tempNode.left !== null) {
        tempNode = tempNode.left;
      }
      this.remove(tempNode.value);
      cur.value = tempNode.value;
    }
  }
}
// 示例使用
const bst = new BinarySearchTree();
/** 
    5
   / \
  3   7
 / \   \
2   4   6
        \
         8
 */
// insert 方法示例
bst.insert(5);
bst.insert(3);
bst.insert(7);
bst.insert(2);
bst.insert(4);
bst.insert(6);
bst.insert(8);
console.log('插入节点后的树结构（假设可以打印树结构）', bst.levelOrder());

// remove 方法示例
bst.remove(3);
console.log('删除节点 3 后的树结构（假设可以打印树结构）', bst.levelOrder());
