import { useState } from 'react';
import { SFCSheetItem } from './demo';

const SheetList = () => {
  const [count, setCount] = useState(0);
  const [sheets] = useState([
    { id: '1', name: 'Sheet1' },
    { id: '2', name: 'Sheet2' },
    { id: '3', name: 'Sheet3' },
    { id: '4', name: 'Sheet4' },
  ]);
  const DragItem = (props: { id: string; name: string }) => <SFCSheetItem {...props} />;
  const forceUpdate = () => setCount((prev) => prev + 1);

  return (
    <div>
      <button onClick={forceUpdate}>触发父组件重渲染</button>
      <p>重渲染次数: {count}</p>
      {sheets.map((sheet) => (
        <DragItem key={sheet.id} {...sheet} />
      ))}
    </div>
  );
};

export default SheetList;
