import { useState, useEffect, useRef, useMemo } from 'react';
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

  // 切换自动更新状态
  const toggleRunning = () => {
    setIsRunning((prev) => !prev);
  };

  const DragItem = useMemo(() => {
    return (props: { id: string; name: string }) => <SFCSheetItem {...props} />;
  }, []);

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
