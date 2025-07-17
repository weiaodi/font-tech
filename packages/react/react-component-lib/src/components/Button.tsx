import React from 'react';
import './ChildComponent.less';

const ChildComponent: React.FC = () => {
  return (
    <div className="child-component">
      <h2 className="child-title">子组件标题</h2>
      <button className="child-button">子组件按钮</button>
    </div>
  );
};

export default ChildComponent;
