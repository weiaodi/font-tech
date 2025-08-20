import { useState, useEffect, useRef } from 'react';
import { SFCSheetItem } from './demo';

const SheetListAuto = () => {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false); // 控制自动更新状态
  const intervalRef = useRef<number | null>(null);
  const [sheets] = useState([
    { id: '1', name: 'Sheet1' },
    { id: '2', name: 'Sheet2' },
    { id: '3', name: 'Sheet3' },
    { id: '4', name: 'Sheet4' },
    { id: '5', name: 'Sheet1' },
    { id: '6', name: 'Sheet2' },
    { id: '7', name: 'Sheet3' },
    { id: '8', name: 'Sheet4' },
  ]);

  // 保持内部定义以触发组件频繁卸载/重建
  const DragItem = (props: { id: string; name: string }) => <SFCSheetItem {...props} />;

  // 自动更新逻辑：每100毫秒重渲染一次
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setCount((prev) => prev + 1);
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 组件卸载时清理定时器
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // 统计DOM节点状态
  useEffect(() => {
    const logDomStats = () => {
      const allWeiNodes = document.querySelectorAll('.wei');
      const detachedNodes = Array.from(allWeiNodes).filter((node) => !document.body.contains(node));

      console.log(`--- 第${count}次更新统计 ---`);
      console.log(`总.wei节点数: ${allWeiNodes.length}`);
      console.log(`游离.wei节点数: ${detachedNodes.length}`);
      console.log('------------------------');
    };

    // 每次count更新后统计（延迟确保DOM已更新）
    setTimeout(logDomStats, 0);
  }, [count]);

  // 切换自动更新状态
  const toggleRunning = () => {
    setIsRunning((prev) => !prev);
  };

  return (
    <div>
      <button onClick={toggleRunning} style={{ padding: '8px 16px', fontSize: '16px' }}>
        {isRunning ? '暂停更新' : '继续更新'}
      </button>
      <p>自动更新次数: {count}</p>
      <p>状态: {isRunning ? '正在自动更新...' : '已暂停'}</p>
      <div style={{ marginTop: '16px' }}>
        {sheets.map((sheet) => (
          <DragItem key={sheet.id} {...sheet} />
        ))}
      </div>
    </div>
  );
};

export default SheetListAuto;
