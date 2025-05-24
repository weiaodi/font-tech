/* 基于邻接矩阵实现的无向图类 */
class GraphAdjMat {
  vertices = [];
  adMatrix = [];
  constructor(vertices, edges) {
    for (const vertice of vertices) {
      this.addVertex(vertice);
    }
    for (const [from, to] of edges) {
      this.addEdge(from, to);
    }
  }
  size() {
    return this.vertices.length;
  }
  addVertex(vertice) {
    //   [北京]   /   [[0]]
    const n = this.size();
    this.vertices.push(vertice);
    let newRow = [];
    for (let index = 0; index < n; index++) {
      newRow.push(0);
    }
    this.adMatrix.push(newRow);
    for (const row of this.adMatrix) {
      row.push(0);
    }
  }
  removeVertex(index) {
    if (index > this.size()) {
      throw Error('越界');
    }
    this.vertices.splice(index, 1);
    this.adMatrix.splice(index, 1);
    for (const row of this.adMatrix) {
      row.splice(index, 1);
    }
  }
  addEdge(from, to) {
    if (from < 0 || to < 0 || Math.max(this.size(), from, to) !== this.size()) {
      throw Error('越界');
    }
    this.adMatrix[from][to] = 1;
    this.adMatrix[to][from] = 1;
  }
  removeEdge(from, to) {
    if (from < 0 || to < 0 || Math.max(this.size(), from, to) !== this.size()) {
      throw Error('越界');
    }
    this.adMatrix[from][to] = 0;
    this.adMatrix[to][from] = 0;
  }
  print() {
    console.log(this.vertices);
    console.log(this.adMatrix);
  }
  printAdjacencyList() {
    const list = [];
    for (let i = 0; i < this.size(); i++) {
      const neighbors = [];
      for (let j = 0; j < this.size(); j++) {
        if (this.adMatrix[i][j] === 1) {
          neighbors.push(this.vertices[j]);
        }
      }
      list.push(`${this.vertices[i]}: ${neighbors.join(' ↔ ')}`);
    }
    console.log('邻接表表示:');
    console.log(list.join('\n'));
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
cityGraph.printAdjacencyList();
