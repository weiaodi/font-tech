import React from 'react';
import './ParentComponent.less';
import ChildComponent from './ChildComponent';

const ParentComponent: React.FC = () => {
  return (
    <div className="parent-component">
      <h1>父组件</h1>
      <ChildComponent />
    </div>
  );
};

export default ParentComponent;
