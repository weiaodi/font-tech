// 定义二叉树节点
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// 构建测试树
const root = new TreeNode(1, new TreeNode(2, new TreeNode(4), new TreeNode(5)), new TreeNode(3));

// ===== 前序遍历 =====
function preorderRecursive(root) {
  if (!root) return [];
  return [root.val, ...preorderRecursive(root.left), ...preorderRecursive(root.right)];
}

function preorderIterative(root) {
  if (!root) return [];
  const result = [];
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    result.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return result;
}

// ===== 中序遍历 =====
function inorderRecursive(root) {
  if (!root) return [];
  return [...inorderRecursive(root.left), root.val, ...inorderRecursive(root.right)];
}

function inorderIterative(root) {
  const result = [];
  const stack = [];
  let cur = root;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    result.push(cur.val);
    cur = cur.right;
  }
  return result;
}

// ===== 后序遍历 =====
function postorderRecursive(root) {
  if (!root) return [];
  return [...postorderRecursive(root.left), ...postorderRecursive(root.right), root.val];
}

function postorderIterative(root) {
  if (!root) return [];
  const result = [];
  const stack = [];
  let current = root;
  let lastVisited = null;

  while (current || stack.length) {
    if (current) {
      stack.push(current);
      current = current.left;
    } else {
      const peekNode = stack[stack.length - 1];
      if (peekNode.right && lastVisited !== peekNode.right) {
        current = peekNode.right;
      } else {
        result.push(peekNode.val);
        lastVisited = stack.pop();
      }
    }
  }
  return result;
}

// 测试输出
console.log('前序遍历:');
console.log('递归:', preorderRecursive(root)); // 预期: [1, 2, 4, 5, 3]
console.log('迭代:', preorderIterative(root)); // 预期: [1, 2, 4, 5, 3]

console.log('\n中序遍历:');
console.log('递归:', inorderRecursive(root)); // 预期: [4, 2, 5, 1, 3]
console.log('迭代:', inorderIterative(root)); // 预期: [4, 2, 5, 1, 3]

console.log('\n后序遍历:');
console.log('递归:', postorderRecursive(root)); // 预期: [4, 5, 2, 3, 1]
console.log('迭代:', postorderIterative(root)); // 预期: [4, 5, 2, 3, 1]
