import React, { useEffect } from 'react';
import './ParentComponent.less';
import { ChildComponent } from 'react-component-lib';

const ParentComponent: React.FC = () => {
  useEffect(() => {
    // 创建样式标签
    const style = document.createElement('style');
    // 定义要注入的样式（针对子组件的类名）
    style.textContent = `
      /* 子组件容器样式 */
      .parent-component .child-component {
        background: yellow !important;
        padding: 16px;
      }
      
      /* 子组件标题样式 */
      .parent-component .child-title {
        color: red !important;
        font-size: 18px;
      }
      
      /* 子组件按钮样式 */
      .parent-component .child-button {
        background: green !important;
        color: white;
        border: none;
        padding: 8px 16px;
      }
    `;

    // 添加到 head 中
    document.head.appendChild(style);

    // 组件卸载时移除样式，避免全局污染
    return () => {
      document.head.removeChild(style);
    };
  }, []); // 空依赖数组：只在组件挂载时执行一次

  return (
    <div className="parent-component">
      <h1>父组件</h1>
      <p>这个 ChildComponent 来自 react-component-lib 组件库</p>
      <ChildComponent />
    </div>
  );
};

export default ParentComponent;
