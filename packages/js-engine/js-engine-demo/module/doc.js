/* 
在 JavaScript 里，`require` 和 `import` 都可用于模块导入，不过它们分属于不同的模块系统，在语法、使用场景、加载机制等方面存在明显差异，下面为你详细介绍。

### 所属模块系统
- **`require`**：这是 CommonJS 模块系统的导入语法，CommonJS 主要应用于服务器端的 Node.js 环境。在 Node.js 中，每个文件都被视作一个独立的模块，`require` 用于在一个模块里引入其他模块。
- **`import`**：属于 ES6（ES2015）引入的原生 JavaScript 模块系统，它为 JavaScript 带来了标准化的模块导入和导出方式，既可以在浏览器环境使用，也能在 Node.js 环境使用（Node.js 从版本 13.2.0 开始，默认支持 ES 模块）。

### 语法差异
- **`require`**：使用简单的函数调用语法。基本语法如下：
```javascript
const module = require('module-name');
```
这里的 `module-name` 可以是 Node.js 的内置模块、本地模块（以相对路径或绝对路径指定）或者第三方模块（安装在 `node_modules` 目录下）。

- **`import`**：语法更加多样化，有多种导入方式。常见的语法如下：
```javascript
导入整个模块
import module from 'module-name';

导入模块中的特定导出项
import { export1, export2 } from 'module-name';

导入模块中的特定导出项并进行重命名
import { export1 as newName1, export2 as newName2 } from 'module-name';

导入整个模块并将其作为一个命名空间对象
import * as module from 'module-name';

只执行模块代码，不导入任何导出项
import 'module-name';
```

### 静态导入与动态导入
- **`require`**：是动态导入，意味着可以在代码的任何位置使用 `require` 导入模块，甚至可以在条件语句或循环语句中使用。例如：
```javascript
if (condition) {
    const module = require('module-name');
}
```
- **`import`**：默认是静态导入，需要在文件的顶部进行导入操作，不能在条件语句或循环语句中动态导入。不过，ES2020 引入了动态导入语法 `import()`，它返回一个 Promise，可以在代码的任何位置使用，实现动态加载模块。示例如下：
```javascript
if (condition) {
    import('module-name').then(module => {
        使用导入的模块
    });
}
```

### 加载机制
- **`require`**：采用同步加载机制，在执行 `require` 语句时，Node.js 会暂停当前模块的执行，直到被导入的模块加载完成并返回导出的内容。这在服务器端环境中通常不会有太大问题，但在浏览器环境中可能会导致页面卡顿。
- **`import`**：ES 模块采用异步加载机制，浏览器会并行加载所有依赖的模块，不会阻塞页面的渲染。在 Node.js 中，ES 模块同样是异步加载的。

### 导出方式的对应
- **`require`**：通常与 `module.exports` 或 `exports` 配合使用。`module.exports` 用于指定模块的导出内容，`exports` 是 `module.exports` 的引用。示例如下：
```javascript
导出单个值
module.exports = value;

导出多个值
module.exports = {
    export1: value1,
    export2: value2
};

另一种导出多个值的方式
exports.export1 = value1;
exports.export2 = value2;
```
- **`import`**：与 `export` 或 `export default` 配合使用。`export` 用于导出多个命名导出项，`export default` 用于导出默认导出项。示例如下：
```javascript
导出多个命名导出项
export const export1 = value1;
export const export2 = value2;

导出默认导出项
export default value;
```

### 兼容性
- **`require`**：在 Node.js 环境中广泛支持，但在浏览器环境中需要借助打包工具（如 Webpack、Browserify 等）才能使用。
- **`import`**：现代浏览器大多支持 ES 模块，但对于一些旧版本的浏览器，可能需要进行转换或使用垫片（polyfill）。在 Node.js 中，需要使用 `.mjs` 文件扩展名或者在 `package.json` 中设置 `"type": "module"` 来启用 ES 模块支持。

综上所述，`require` 和 `import` 各有特点，`require` 适用于 Node.js 环境下的传统开发，而 `import` 是 JavaScript 标准化的模块导入方式，更适合现代的前端和后端开发。 
*/
