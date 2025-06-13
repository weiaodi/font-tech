以下是一个完整的 `package.json` 文件示例，包含了常见的字段和详细注释：

```json
{
  "name": "my-react-app", // 项目名称（必须小写，只能包含字母、数字、连字符、下划线）
  "version": "1.0.0", // 版本号（遵循语义化版本：MAJOR.MINOR.PATCH）
  "description": "A modern React application with TypeScript and Tailwind CSS", // 项目描述
  "keywords": ["react", "typescript", "tailwind", "webapp"], // 项目关键词（用于npm搜索）
  "homepage": "https://example.com", // 项目主页URL
  "bugs": {
    // 项目问题追踪URL和邮箱
    "url": "https://github.com/user/repo/issues",
    "email": "support@example.com"
  },
  "repository": {
    // 代码仓库信息
    "type": "git",
    "url": "git+https://github.com/user/repo.git"
  },
  "license": "MIT", // 开源许可证
  "author": {
    // 作者信息
    "name": "John Doe",
    "email": "john@example.com",
    "url": "https://john.doe"
  },

  // 项目入口文件（require('my-react-app')时加载的文件）
  "main": "dist/index.js",
  // 模块入口文件（ES模块导入时的入口）
  "module": "dist/index.mjs",
  // 类型定义文件（TypeScript项目）
  "types": "dist/index.d.ts",

  // 生产环境依赖（部署时需要安装的包）
  "dependencies": {
    "react": "^18.2.0", // 允许升级到18.x.x，但不包括19.0.0
    "react-dom": "^18.2.0",
    "axios": "^1.6.7", // HTTP客户端
    "react-router-dom": "^6.15.0", // 路由库
    "styled-components": "^6.1.1", // CSS-in-JS库
    "lodash": "~4.17.21" // 允许升级到4.17.x，但不包括4.18.0
  },

  // 开发环境依赖（仅开发和测试阶段需要的包）
  "devDependencies": {
    "@types/react": "^18.2.33", // React的类型定义
    "@types/react-dom": "^18.2.11",
    "typescript": "^5.3.2", // TypeScript编译器
    "vite": "^5.0.0", // 构建工具
    "eslint": "^8.56.0", // 代码检查工具
    "prettier": "^3.1.1", // 代码格式化工具
    "jest": "^29.7.0", // 测试框架
    "husky": "^8.0.3", // Git钩子工具
    "lint-staged": "^15.2.0" // 提交前执行脚本
  },

  // 可选依赖（安装失败不会影响项目运行）
  "optionalDependencies": {
    "fsevents": "^2.3.3" // macOS文件系统监听优化（可选）
  },

  // 对等依赖（声明项目需要的宿主环境版本）
  "peerDependencies": {
    "react": ">=18.0.0" // 此项目需要React 18+作为宿主环境
  },

  // 脚本命令（通过npm run执行）
  "scripts": {
    "dev": "vite", // 启动开发服务器
    "build": "tsc && vite build", // 生产环境构建（先编译TypeScript）
    "preview": "vite preview", // 预览生产构建
    "test": "jest", // 运行测试
    "lint": "eslint src --ext .ts,.tsx", // 代码检查
    "format": "prettier --write src", // 代码格式化
    "prepare": "husky install", // 初始化husky钩子
    "pre-commit": "lint-staged" // 提交前执行lint-staged
  },

  // 配置lint-staged（提交前自动格式化和检查代码）
  "lint-staged": {
    "*.{ts,tsx}": ["prettier --write", "eslint --fix"]
  },

  // 指定项目支持的浏览器版本（影响Babel、PostCSS等工具）
  "browserslist": ["last 2 versions", "not dead", "Chrome >= 64", "Firefox >= 60", "Safari >= 12", "iOS >= 12"],

  // 指定项目运行所需的Node和npm版本
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },

  // 配置pnpm的hoist策略（控制依赖提升行为）
  "pnpm": {
    "hoistPattern": ["*react*", "*redux*"]
  },

  // 配置TypeScript编译选项（替代tsconfig.json）
  "tsconfig": {
    "extends": "@tsconfig/create-react-app/tsconfig.json",
    "compilerOptions": {
      "jsx": "react-jsx"
    }
  },

  // 配置 Jest 测试环境
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "jsdom"
  }
}
```
