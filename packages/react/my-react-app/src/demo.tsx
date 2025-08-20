import { useState, useEffect, useRef } from 'react';

// 生成随机标识的工具函数
const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 8); // 6位随机字符串
};

export const SFCSheetItem = ({ id, name }: { id: string; name: string }) => {
  const domRef = useRef<HTMLDivElement>(null);
  const [isClicked, setIsClicked] = useState(false);
  const instanceId = useRef(`ins-${id}-${generateRandomId()}`); // 实例唯一标识

  useEffect(() => {
    console.log(`[${instanceId.current}] 组件挂载 - ${name}`);

    const handleClick = () => {
      setIsClicked(true);
    };

    const currentDom = domRef.current;
    if (currentDom) {
      currentDom.addEventListener('click', handleClick);
      // 添加随机标识属性，方便在DOM中定位
      currentDom.setAttribute('data-instance-id', instanceId.current);
    }

    return () => {
      console.log(`[${instanceId.current}] 组件卸载 - ${name}`);
      const dom = domRef.current;
      if (dom) {
        dom.removeEventListener('click', handleClick);
        const isDetached = !document.body.contains(dom);
        console.log(`[${instanceId.current}] 卸载状态: ${isDetached ? '已游离' : '仍在文档树'}`);
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
        color: isClicked ? 'red' : 'inherit',
      }}
    >
      {name} (ID: {instanceId.current.slice(-6)})
    </div>
  );
};
