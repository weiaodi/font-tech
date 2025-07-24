// 1. 定义类型接口
interface User {
  isAuthenticated: boolean;
  role: 'admin' | 'moderator' | 'user';
  isBlocked: boolean;
  ip: string;
  permissions: string[];
}

interface GlobalState {
  isMaintenanceMode: boolean;
  ipBlacklist: string[];
}

// 2. 拆分校验逻辑为独立函数（单一职责）
/** 校验用户是否已登录 */
function isUserAuthenticated(user: User) {
  return user.isAuthenticated;
}

/** 校验用户权限级别是否足够（管理员或版主） */
function hasSufficientRole(user: User) {
  return user.role === 'admin' || user.role === 'moderator';
}

/** 校验用户是否未被封禁 */
function isUserNotBlocked(user: User) {
  return !user.isBlocked;
}

/** 校验系统是否不在维护模式 */
function isSystemOperational(global: GlobalState) {
  return !global.isMaintenanceMode;
}

/** 校验用户IP是否不在黑名单中 */
function isIpAllowed(user: User, global: GlobalState) {
  return !global.ipBlacklist.includes(user.ip);
}

// 业务逻辑函数（依赖校验结果）
function handleSensitiveOperation(user: User, global: GlobalState) {
  if (
    isUserAuthenticated(user) // 1. 先校验用户登录状态
    && hasSufficientRole(user) // 2. 再校验权限级别
    && isUserNotBlocked(user) // 3. 接着校验封禁状态
    && isSystemOperational(global) // 4. 然后校验系统状态
    && isIpAllowed(user, global) // 5. 再校验IP限制
  ) {
    console.log('执行敏感操作：所有校验通过');
  }
}
