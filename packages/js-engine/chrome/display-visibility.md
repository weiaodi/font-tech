在浏览器的渲染流程中，**`display: none`** 和 **`visibility: hidden`** 对元素的处理方式存在本质区别，这导致它们在 DOM 树和渲染树中的表现不同。以下是详细解释：

### 一、DOM 树 vs 渲染树

1. **DOM 树**

   - 由 HTML 元素和 JavaScript 动态创建的元素组成
   - 包含所有元素，无论其是否可见
   - 是文档的结构表示

2. **渲染树（Render Tree）**
   - 是 DOM 树的视觉表示
   - 只包含需要显示在屏幕上的元素
   - 每个节点包含几何信息（位置、大小、边距等）

### 二、display: none 的处理

当元素设置为 **`display: none`** 时：

1. **DOM 树**

   - 元素仍然存在于 DOM 树中
   - 可以通过 JavaScript 访问和操作

2. **渲染树**

   - **元素及其所有子元素被完全排除在渲染树外**
   - 不占用布局空间（就像元素不存在一样）
   - 不会触发绘制（painting）

3. **性能影响**
   - 修改 `display` 属性会触发 **重排（reflow）和重绘（repaint）**
   - 频繁切换可能影响性能

### 三、visibility: hidden 的处理

当元素设置为 **`visibility: hidden`** 时：

1. **DOM 树**

   - 元素仍然存在于 DOM 树中
   - 可以通过 JavaScript 访问和操作

2. **渲染树**

   - **元素会被包含在渲染树中**
   - 占用布局空间（保留元素的盒模型）
   - 会触发绘制，但内容不可见（完全透明）

3. **特殊行为**
   - 如果元素是表格的一部分（如 `<tr>`、`<td>`），`visibility: hidden` 可能会被忽略
   - 子元素可以通过设置 `visibility: visible` 重新显示

### 四、核心差异对比

| 属性                | display: none          | visibility: hidden        |
| ------------------- | ---------------------- | ------------------------- |
| 是否存在于 DOM 树中 | 是                     | 是                        |
| 是否存在于渲染树中  | 否                     | 是                        |
| 是否占用布局空间    | 否（不参与布局计算）   | 是（保留盒模型空间）      |
| 子元素是否可见      | 全部不可见（强制继承） | 可通过设置 `visible` 显示 |
| 事件监听            | 无法触发事件           | 可以触发事件（但不可见）  |
| 性能影响            | 重排 + 重绘            | 仅重绘                    |

### 五、示例代码验证

```html
<style>
  .display-none {
    display: none;
  }
  .visibility-hidden {
    visibility: hidden;
  }
</style>

<div id="container">
  <div id="element1" class="display-none">Element 1</div>
  <div id="element2" class="visibility-hidden">Element 2</div>
</div>

<script>
  // 验证 DOM 存在性
  console.log(document.getElementById('element1')); // 存在
  console.log(document.getElementById('element2')); // 存在

  // 验证布局空间
  const containerRect = document.getElementById('container').getBoundingClientRect();
  // Element 1 不影响 container 尺寸
  // Element 2 保留空间，影响 container 尺寸
</script>
```

### 六、使用场景建议

1. **使用 `display: none` 的场景**

   - 完全隐藏元素，不希望其占用任何空间
   - 实现元素的动态显示/隐藏（如菜单、模态框）

2. **使用 `visibility: hidden` 的场景**
   - 需要保留元素的布局空间（如占位符）
   - 实现动画过渡（从可见到不可见的平滑变化）
   - 需要元素继续接收事件（如不可见的按钮用于辅助技术）

### 七、浏览器渲染流程中的关键步骤

```
1. 解析 HTML 构建 DOM 树
2. 解析 CSS 构建 CSSOM 树
3. 合并 DOM 和 CSSOM 生成渲染树
4. 计算每个元素的布局（Layout）
5. 将元素绘制到屏幕上（Paint）

// display: none 的元素在步骤 3 被排除
// visibility: hidden 的元素参与步骤 3-5，但在绘制时变为透明
```

### 总结

`display: none` 和 `visibility: hidden` 的核心区别在于它们对渲染树的影响：

- **`display: none`** 会将元素从渲染树中完全移除，导致其不占用空间且不可见
- **`visibility: hidden`** 会保留元素在渲染树中的位置，仅使其内容不可见但仍占用布局空间

理解这种差异有助于在开发中正确选择隐藏元素的方式，并优化页面性能。
