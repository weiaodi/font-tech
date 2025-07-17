# React Component Library

一个简单的 React 组件库，提供可复用的 UI 组件。

## 安装

```bash
pnpm add react-component-lib
```

## 使用

```tsx
import { Button } from 'react-component-lib';

function App() {
  return (
    <div>
      <Button variant="primary" onClick={() => alert('Hello!')}>
        点击我
      </Button>

      <Button variant="secondary" size="large">
        大按钮
      </Button>

      <Button variant="outline" disabled>
        禁用按钮
      </Button>
    </div>
  );
}
```

## 组件

### Button

一个可定制的按钮组件。

#### Props

- `children`: React.ReactNode - 按钮内容
- `onClick?: () => void` - 点击事件处理函数
- `variant?: 'primary' | 'secondary' | 'outline'` - 按钮样式变体
- `size?: 'small' | 'medium' | 'large'` - 按钮大小
- `disabled?: boolean` - 是否禁用
- `className?: string` - 额外的 CSS 类名

## 开发

```bash
# 安装依赖
pnpm install

# 构建组件库
pnpm build

# 开发模式（监听文件变化）
pnpm dev
```
