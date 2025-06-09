/* 基于邻接矩阵实现的无向图类 */
class GraphAdjMat {
  vertices; // 顶点列表，元素代表“顶点值”，索引代表“顶点索引”
  adjMat; // 邻接矩阵，行列索引对应“顶点索引”

  /* 构造函数 */
  constructor(vertices, edges) {
    this.vertices = [];
    this.adjMat = [];
    // 添加顶点
    for (const val of vertices) {
      this.addVertex(val);
    }
    // 添加边
    // 请注意，edges 元素代表顶点索引，即对应 vertices 元素索引
    for (const e of edges) {
      this.addEdge(e[0], e[1]);
    }
  }

  /* 获取顶点数量 */
  size() {
    return this.vertices.length;
  }

  /* 添加顶点 */
  addVertex(val) {
    const n = this.size();
    // 向顶点列表中添加新顶点的值
    this.vertices.push(val);
    // 在邻接矩阵中添加一行
    const newRow = [];
    for (let j = 0; j < n; j++) {
      newRow.push(0);
    }
    this.adjMat.push(newRow);
    // 在邻接矩阵中添加一列
    for (const row of this.adjMat) {
      row.push(0);
    }
  }

  /* 删除顶点 */
  removeVertex(index) {
    if (index >= this.size()) {
      throw new RangeError('Index Out Of Bounds Exception');
    }
    // 在顶点列表中移除索引 index 的顶点
    this.vertices.splice(index, 1);

    // 在邻接矩阵中删除索引 index 的行
    this.adjMat.splice(index, 1);
    // 在邻接矩阵中删除索引 index 的列
    for (const row of this.adjMat) {
      row.splice(index, 1);
    }
  }

  /* 添加边 */
  // 参数 i, j 对应 vertices 元素索引
  addEdge(i, j) {
    // 索引越界与相等处理
    if (i < 0 || j < 0 || i >= this.size() || j >= this.size() || i === j) {
      throw new RangeError('Index Out Of Bounds Exception');
    }
    // 在无向图中，邻接矩阵关于主对角线对称，即满足 (i, j) === (j, i)
    this.adjMat[i][j] = 1;
    this.adjMat[j][i] = 1;
  }

  /* 删除边 */
  // 参数 i, j 对应 vertices 元素索引
  removeEdge(i, j) {
    // 索引越界与相等处理
    if (i < 0 || j < 0 || i >= this.size() || j >= this.size() || i === j) {
      throw new RangeError('Index Out Of Bounds Exception');
    }
    this.adjMat[i][j] = 0;
    this.adjMat[j][i] = 0;
  }

  /* 打印邻接矩阵 */
  print() {
    console.log('顶点列表 = ', this.vertices);
    console.log('邻接矩阵 =', this.adjMat);
  }
}
// 创建顶点和边
const vertices = ['北京', '上海', '广州', '深圳'];
const edges = [
  [0, 1], // 北京-上海
  [0, 2], // 北京-广州
  [1, 2], // 上海-广州
  [2, 3], // 广州-深圳
];

// 创建图
const cityGraph = new GraphAdjMat(vertices, edges);
console.log('初始图:');
cityGraph.print();

// 添加顶点
cityGraph.addVertex('杭州');
console.log("\n添加顶点 '杭州' 后:");
cityGraph.print();

// 添加边
cityGraph.addEdge(1, 4); // 上海-杭州
console.log("\n添加边 '上海-杭州' 后:");
cityGraph.print();

// 删除边
cityGraph.removeEdge(0, 2); // 删除 北京-广州
console.log("\n删除边 '北京-广州' 后:");
cityGraph.print();

// 删除顶点
cityGraph.removeVertex(3); // 删除 深圳
console.log("\n删除顶点 '深圳' 后:");
cityGraph.print();

// 获取顶点数量
console.log('\n当前顶点数量:', cityGraph.size());
