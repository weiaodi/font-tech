// 1. 定义类型接口
interface User {
  isAuthenticated: boolean;
  role: 'admin' | 'moderator' | 'user'; // 限定角色范围
  isBlocked: boolean;
  ip: string;
  permissions: string[]; // 权限列表
}

interface GlobalState {
  isMaintenanceMode: boolean; // 系统维护状态
  ipBlacklist: string[]; // IP黑名单
}

// 2. 完整的校验函数与业务逻辑
function handleSensitiveOperation(user: User, globalState: GlobalState) {
  // 多条件组合校验（按顺序判断）
  if (
    // 1. 用户必须已登录
    user.isAuthenticated
    // 2. 权限级别校验（管理员或版主）
    && (user.role === 'admin' || user.role === 'moderator')
    // 3. 用户未被封禁
    && !user.isBlocked
    // 4. 系统不在维护模式
    && !globalState.isMaintenanceMode
    // 5. IP 不在黑名单中
    && !globalState.ipBlacklist.includes(user.ip)
  ) {
    // 执行敏感操作（例如删除数据、修改配置等）
    console.log('执行敏感操作：用户权限验证通过');
  }
}

// 3. 使用示例
const currentUser: User = {
  isAuthenticated: true,
  role: 'moderator',
  isBlocked: false,
  ip: '192.168.1.100',
  permissions: ['edit', 'view'],
};

const appGlobalState: GlobalState = {
  isMaintenanceMode: false,
  ipBlacklist: ['192.168.1.99'],
};

// 调用函数
const result = handleSensitiveOperation(currentUser, appGlobalState);
