const fs = require('fs');
const path = require('path');
const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// 解析模块，返回模块信息和依赖项
function parseModule(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const ast = babylon.parse(content, { sourceType: 'module' });
  const dependencies = [];

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  return {
    filePath,
    dependencies,
  };
}

// 构建依赖关系图
function buildDependencyGraph(entry) {
  const graph = [];
  const queue = [entry];
  console.log('🚀 ~ buildDependencyGraph ~ queue:', queue);
  const visited = new Set();

  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    const moduleInfo = parseModule(current);
    console.log('🚀 ~ buildDependencyGraph ~ moduleInfo:', moduleInfo);
    graph.push(moduleInfo);

    moduleInfo.dependencies.forEach((dep) => {
      // 当前文件的路径添加上该文件依赖的文件信息,均放入执行队列中
      const depPath = path.join(path.dirname(current), dep);
      queue.push(depPath);
      console.log('🚀 ~ moduleInfo.dependencies.forEach ~ queue:', queue);
    });
  }

  return graph;
}
// 获取当前文件所在目录
const currentDir = __dirname;
// 计算 math.js 的绝对路径
const mathModulePath = path.resolve(currentDir, './src/index.js');

const dependencyGraph = buildDependencyGraph(mathModulePath);
console.log(dependencyGraph);
