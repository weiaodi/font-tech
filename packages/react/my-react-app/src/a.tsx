import { useState, useEffect, useRef } from 'react';
import type { JSX } from 'react/jsx-runtime';

const SFCSheetItem = ({ id, name }: { id: string; name: string }) => {
  const [isClicked, setIsClicked] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  // 处理点击事件的函数
  const handleClick = () => {
    setIsClicked(true); // 更新状态
  };

  // 通过 useEffect 绑定和解绑事件监听
  useEffect(() => {
    const currentDom = domRef.current;
    if (currentDom) {
      // 添加原生事件监听
      currentDom.addEventListener('click', handleClick);
      console.log(`组件 ${id} 绑定点击事件`);
    }

    // 清理函数：移除事件监听（避免内存泄漏）
    return () => {
      if (currentDom) {
        currentDom.removeEventListener('click', handleClick);
        console.log(`组件 ${id} 移除点击事件`);
      }
    };
  }, [id]); // 仅在 id 变化时重新绑定（通常不需要）

  return (
    <div
      ref={domRef} // 绑定 ref 获取 DOM 元素
      style={{
        padding: '8px',
        border: '1px solid #ccc',
        margin: '4px',
        cursor: 'pointer',
        // 根据状态动态设置样式
        color: isClicked ? 'red' : 'inherit',
        borderColor: isClicked ? 'red' : '#ccc',
      }}
    >
      {name} {isClicked ? '(已点击)' : ''}
    </div>
  );
};

const generateSheets = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: (i + 1).toString(),
    name: `Sheet${i + 1}`,
  }));
};

const SheetList = () => {
  const [count, setCount] = useState(0);
  const [sheets] = useState(generateSheets());

  const forceUpdate = () => setCount((prev) => prev + 1);

  const A = (props: JSX.IntrinsicAttributes & { id: string; name: string }) => {
    return <SFCSheetItem {...props} />;
  };

  return (
    <div>
      <button onClick={forceUpdate}>触发父组件重渲染，当前次数: {count}</button>

      {sheets.map((sheet) => (
        <A key={sheet.id} {...sheet} />
      ))}
    </div>
  );
};

export default SheetList;
