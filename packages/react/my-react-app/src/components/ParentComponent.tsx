import React from 'react';
import ChildComponent from './ChildComponent';
import './ParentComponent.less';

const ParentComponent: React.FC = () => {
  return (
    <div className="parent-component">
      <h1>父组件</h1>
      <ChildComponent />
    </div>
  );
};

export default ParentComponent;
