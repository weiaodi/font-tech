// 定义一些对象
let obj1 = {
  name: 'Object 1',
  data: 'Some data for Object 1',
};

let obj2 = {
  name: 'Object 2',
  data: 'Some data for Object 2',
};

// 让 obj1 引用 obj2
obj1.reference = obj2;

// 根对象（在浏览器环境中是 window，这里简单理解为全局作用域下的可访问对象）
// 从根对象出发可以访问到 obj1 和 obj2

// 现在假设 obj1 不再被需要，将其引用设为 null
obj1 = null;

// 此时，obj2 仍然可以通过之前 obj1 对它的引用（obj1.reference）被访问到，所以 obj2 是活跃的
// 而 obj1 所指向的对象（{ name: "Object 1", data: "Some data for Object 1" }）已经无法从根对象访问到了

// 模拟垃圾回收的标记阶段
// 垃圾回收器从根对象开始遍历，标记所有可访问的对象
// 这里假设垃圾回收器标记了 obj2（因为可以从根对象间接访问到），但没有标记 obj1 所指向的对象

// 模拟垃圾回收的清除阶段
// 垃圾回收器遍历所有对象，发现 obj1 所指向的对象没有被标记，将其视为垃圾并释放内存
// 而 obj2 因为被标记了，所以不会被回收

// 过一段时间后，如果 obj2 也不再被需要，将其引用设为 null
obj2 = null;

// 当下一次垃圾回收时，垃圾回收器再次从根对象开始遍历
// 这次发现没有从根对象可访问到 obj2 了，所以标记阶段不会标记 obj2
// 清除阶段会将 obj2 所占用的内存释放掉

/*
分离的 DOM 引用
DOM 节点的内存被回收要满足两点：DOM 节点在 DOM 树上被移除，并且代码中没有对他的引用。内存泄漏发生在节点从 DOM 上被删除了，但代码中留存着对它的 JS 引用，我们称这种为分离的 DOM 节点。

实现分离的 DOM 引用的内存泄漏示例：

<body>
  <button>移除列表</button>
  <ul id="list">
    <li>项目1</li>
  </ul>
  <script type="text/javascript">
    var button = document.getElementById('button');
    var list = document.getElementById('list');

    button.addEventListener('click', function () {
      list.remove();
    });
  </script>
</body>
可以通过堆快照（Heap Snapshot），调试路径 Memory -> Heap Snapshot -> Take Snapshot，堆快照可以直接告诉我们是否存在分离的 DOM 节点，只要在顶部过滤框 filter 输入 detached，如果过滤出东西，说明存在分离的 DOM 节点。



在 JavaScript 中，当函数执行完毕后，函数内部的局部变量通常会被销毁，内存会被回收。然而，控制台打印的信息有所不同，主要原因如下：

控制台的持久化存储机制：
控制台的设计目的是为了方便开发者查看和分析代码运行时的信息，所以它会将打印的信息进行持久化存储，以便开发者随时查看。即使函数执行结束，控制台也不会自动删除这些信息，因为开发者可能在后续的操作中需要回顾之前打印的内容。

引用关系导致内存无法回收：
控制台对打印的信息保持着引用。只要有引用存在，垃圾回收机制就不会将其占用的内存回收。以在函数中使用 console.log 为例，当函数执行时，console.log 将信息输出到控制台，控制台会持有对这些信息的引用。函数执行完后，虽然函数内部的局部变量失去了引用，会被垃圾回收机制回收，但控制台中打印的信息由于被控制台引用着，所以不会被删除，其占用的内存也不会被回收。


*/
