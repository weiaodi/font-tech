import React, { useState, useEffect, useRef } from 'react';

export const SFCSheetItem = ({ id, name }: { id: string; name: string }) => {
  const domRef = useRef<HTMLDivElement>(null);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const handleClick = () => {
      console.log(`点击了sheet: ${name} (id: ${id})`);
      setIsClicked(true);
    };

    const currentDom = domRef.current;
    if (currentDom) {
      currentDom.addEventListener('click', handleClick);
      console.log(`监听 [${name}] 绑定事件`);
    }
    // 清理函数：移除事件监听
    return () => {
      if (currentDom) {
        currentDom.removeEventListener('click', handleClick);
        console.log(`[${name}] 移除事件监听`);
      }
    };
  }, [name, id]);

  return (
    <div
      className="wei"
      ref={domRef}
      style={{
        padding: '8px',
        border: '1px solid #ccc',
        margin: '4px',
        // 根据点击状态动态设置颜色
        color: isClicked ? 'red' : 'inherit',
      }}
    >
      {name}
    </div>
  );
};
