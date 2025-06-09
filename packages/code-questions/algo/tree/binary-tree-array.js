class BinaryTreeArr {
  #tree;
  constructor(arr) {
    this.#tree = arr;
  }
  size() {
    return this.#tree.length;
  }
  /* 获取索引为 i 节点的值 */
  val(i) {
    // 若索引越界，则返回 null ，代表空位
    if (i < 0 || i >= this.size()) return null;
    return this.#tree[i];
  }
  left(i) {
    return i * 2 + 1;
  }

  right(i) {
    return i * 2 + 2;
  }
  parent(i) {
    return Math.floor((i - 1) / 2);
  }
  #dfs(i, order, res) {
    if (this.val(i) === null) return;

    const visit = () => res.push(this.val(i));
    const traverseLeft = () => this.#dfs(this.left(i), order, res);
    const traverseRight = () => this.#dfs(this.right(i), order, res);

    if (order === 'pre') {
      visit();
      traverseLeft();
      traverseRight();
    } else if (order === 'in') {
      traverseLeft();
      visit();
      traverseRight();
    } else if (order === 'post') {
      traverseLeft();
      traverseRight();
      visit();
    }
  }
  levelOrder() {
    let res = [];
    let n = this.size;
    for (let i = 0; i < n; i++) {
      if (this.val(i) !== null) {
        res.push(this.val(i));
      }
    }
    return res;
  }
  preOrder(i) {
    let result = [];
    this.#dfs(i, 'pre', result);
    return result;
  }
  inOrder(i) {
    let result = [];
    this.#dfs(i, 'in', result);
    return result;
  }
  postOrder(i) {
    let result = [];
    this.#dfs(i, 'post', result);
    return result;
  }
}

// 创建一个完全二叉树数组实例
const treeArray = [1, 2, 3, 4, 5];
const binaryTree = new BinaryTreeArr(treeArray);

// 进行前序遍历
const preOrderResult = binaryTree.preOrder(0);
console.log('前序遍历结果:', preOrderResult);

// 进行中序遍历
const inOrderResult = binaryTree.inOrder(0);
console.log('中序遍历结果:', inOrderResult);

// 进行后序遍历
const postOrderResult = binaryTree.postOrder(0);
console.log('后序遍历结果:', postOrderResult);
// 补充
function demo(params) {
  // 定义一个 person 对象，包含 name 和 age 属性
  let person = {
    name: 'John',
    age: 25,
  };

  function increaseAge(obj) {
    obj.age += 1;
    obj = { name: 'Jane', age: 22 };
    // 打印重新赋值之后的新对象信息
    console.log('在重新赋值变量之后，新的对象是：', obj);
    return obj;
  }

  // 打印调用函数之前原始 person 对象的信息
  console.log('在调用函数之前，原始的 person 对象是：', person);
  let newPerson = increaseAge(person);
  console.log('在调用函数之后，原始的 person 对象是：', person);
  console.log('函数返回的新对象是：', newPerson);
}
// demo();
