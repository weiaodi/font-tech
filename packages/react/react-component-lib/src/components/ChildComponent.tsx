import React from 'react';
import './ChildComponent.less';

const ChildComponent: React.FC = () => {
  return (
    <div className="monorepo-component">
      <h2 className="monorepo-title">仓库组件标题</h2>
      <button className="monorepo-button">仓库组件按钮</button>
    </div>
  );
};

export default ChildComponent;
