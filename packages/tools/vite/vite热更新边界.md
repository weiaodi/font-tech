Vite 的 HMR（热模块替换）通过为不同类型的模块定义明确的**更新边界**，实现了高效且精准的代码更新。这些边界决定了模块更新时的行为（如是否保留状态、如何应用变更）。以下是对不同模块类型的详细解释：

### 一、CSS 文件的 HMR 处理

#### 1. **更新机制**

Vite 对 CSS 文件采用**原子级替换**策略：

- 每个 CSS 文件对应一个唯一的 `<style>` 标签
- 文件更新时，直接替换该标签的内容
- 无需重新渲染组件或页面

#### 2. **关键代码逻辑**

```javascript
// CSS 文件的 HMR 处理（简化）
if (import.meta.hot) {
  import.meta.hot.accept((newCss) => {
    // 找到原 style 标签
    const styleEl = document.getElementById('vite-style-id-123');

    // 替换内容（无需重新加载页面）
    styleEl.textContent = newCss;

    // 可选：添加淡入动画，提升体验
    styleEl.classList.add('fade-in');
    setTimeout(() => styleEl.classList.remove('fade-in'), 100);
  });
}
```

#### 3. **优势**

- **即时生效**：样式更新无需等待组件重新渲染
- **无状态丢失**：不会影响页面上的任何交互状态
- **高性能**：仅操作 DOM 中的 style 标签

### 二、Vue 组件的 HMR 处理

#### 1. **更新机制**

Vue 组件的 HMR 遵循**保留实例状态，更新组件定义**的原则：

- **模板更新**：重新渲染组件，但保留组件实例及其状态
- **样式更新**：与 CSS 文件处理相同，直接替换 style 标签
- **脚本更新**：更新组件方法和计算属性，保留当前数据状态

#### 2. **关键代码逻辑**

```javascript
// Vue 组件的 HMR 处理（简化）
if (import.meta.hot) {
  import.meta.hot.accept((newComp) => {
    // 1. 更新组件定义（模板、方法等）
    updateComponentDefinition(newComp);

    // 2. 递归更新所有已渲染的组件实例
    const instances = getComponentInstances();
    instances.forEach((instance) => {
      instance.$options.render = newComp.render;
      instance.$options.methods = newComp.methods;
      // 其他属性更新...
    });

    // 3. 特殊情况处理：如果是根组件，强制重新渲染
    if (isRootComponent) {
      rootInstance.$forceUpdate();
    }
  });
}
```

#### 3. **状态保留规则**

- **props、data、computed**：保留当前值
- **生命周期钩子**：触发 `updated` 钩子，但不触发 `created` 或 `mounted`
- **全局状态**：如 Vuex 或 Pinia，完全不受影响

### 三、React 组件的 HMR 处理

#### 1. **更新机制**

Vite 结合 **React Fast Refresh** 实现组件级热更新：

- **函数组件**：更新函数实现，但保留状态
- **类组件**：支持方法更新，但不保留状态（类实例会重置）
- **Hooks**：保留 `useState`、`useReducer` 等钩子的状态

#### 2. **关键代码逻辑**

```javascript
// React 组件的 HMR 处理（简化）
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // 1. 获取当前组件定义
    const prevComponent = getCurrentComponent();

    // 2. 更新为新组件定义
    updateComponentDefinition(newModule.Component);

    // 3. 通知 Fast Refresh 运行时
    if (typeof window !== 'undefined' && window.__REACT_HOT_LOADER__) {
      window.__REACT_HOT_LOADER__.register(newModule.Component, 'Component');

      // 4. 尝试重新渲染而不丢失状态
      try {
        refreshWithoutLosingState(prevComponent, newModule.Component);
      } catch (error) {
        // 如果失败，回退到全量刷新
        window.location.reload();
      }
    }
  });
}
```

#### 3. **状态保留规则**

- **函数组件**：
  - 所有 `useState` 和 `useReducer` 状态保留
  - 组件内定义的变量和函数更新为新值
- **类组件**：
  - 仅方法更新（如 `render`、事件处理函数）
  - 实例状态（`this.state`）丢失，需要重新初始化
- **限制**：
  - 不支持修改组件签名（如添加/删除 props）
  - 不支持修改 Hooks 的调用顺序

### 四、自定义模块的 HMR 边界

开发者可以通过 `import.meta.hot` API 自定义 HMR 行为：

```javascript
// 自定义 HMR 处理示例
if (import.meta.hot) {
  // 接收自身模块更新
  import.meta.hot.accept((newModule) => {
    // 自定义更新逻辑
    updateMyModule(newModule);
  });

  // 处理依赖更新
  import.meta.hot.accept('./utils.js', (newUtils) => {
    // 使用新工具函数更新当前模块
    updateUtils(newUtils);
  });

  // 模块卸载前清理
  import.meta.hot.dispose(() => {
    // 清理资源（如定时器、事件监听器）
    clearInterval(timer);
  });
}
```

### 五、不同模块类型的 HMR 对比

| 模块类型       | 更新方式        | 状态保留        | 性能影响            |
| -------------- | --------------- | --------------- | ------------------- |
| CSS            | 替换 style 标签 | 完全保留        | 极低（仅 DOM 操作） |
| Vue 组件       | 更新组件定义    | 保留实例状态    | 低（部分渲染）      |
| React 函数组件 | 更新函数实现    | 保留 Hooks 状态 | 低（部分渲染）      |
| React 类组件   | 更新方法        | 丢失实例状态    | 中（可能全量渲染）  |
| 普通 JS 模块   | 替换模块导出    | 无状态概念      | 低                  |

### 六、最佳实践与注意事项

1. **避免全局副作用**：

   - HMR 更新时，全局变量、定时器等可能导致意外行为
   - 使用 `import.meta.hot.dispose` 清理资源

2. **理解更新边界**：

   - 复杂组件可能需要手动处理 HMR 逻辑
   - 对于不支持状态保留的场景，考虑使用全局状态管理

3. **调试技巧**：

   - 在浏览器控制台查看 HMR 日志（Vite 默认显示更新信息）
   - 使用断点调试复杂的 HMR 逻辑

4. **生产环境禁用**：
   - HMR 仅用于开发环境，生产环境应使用常规打包流程
