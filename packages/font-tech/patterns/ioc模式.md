以下是一个使用 JavaScript 实现的简单 IoC（控制反转）容器示例，附带详细说明：

### **一、IoC 容器实现**

```javascript
class Container {
  constructor() {
    this.dependencies = {}; // 存储已注册的依赖
    this.factories = {}; // 存储依赖的工厂函数
  }

  // 注册依赖（工厂函数形式）
  register(name, factory) {
    this.factories[name] = factory;
    return this;
  }

  // 注册单例（仅初始化一次）
  singleton(name, factory) {
    let instance;
    this.register(name, () => {
      if (!instance) instance = factory(this);
      return instance;
    });
    return this;
  }

  // 获取依赖
  get(name) {
    if (!this.factories[name]) {
      throw new Error(`Dependency ${name} not found`);
    }
    return this.factories[name](this); // 通过工厂函数创建实例
  }
}

// 示例使用
const container = new Container();

// 注册一个简单的依赖
container.register('logger', () => {
  return {
    log: (message) => console.log(`[LOG] ${message}`),
  };
});

// 注册一个依赖其他组件的服务
container.register('userService', (container) => {
  const logger = container.get('logger');
  return {
    createUser: (name) => {
      logger.log(`Creating user: ${name}`);
      return { id: Date.now(), name };
    },
  };
});

// 使用容器获取服务
const userService = container.get('userService');
userService.createUser('John Doe'); // 输出: [LOG] Creating user: John Doe
```

### **二、IoC 核心概念说明**

1. **控制反转（Inversion of Control）**

   - 传统方式：对象内部主动创建依赖（如 `new Logger()`）。
   - IoC 方式：对象仅声明依赖，由容器负责创建和注入（如 `container.get('logger')`）。

2. **依赖注入（Dependency Injection）**

   - 通过容器将依赖传递给对象，而非对象自行创建。
   - 示例中，`userService` 的 `logger` 依赖由容器注入，而非在 `userService` 内部 `new Logger()`。

3. **IoC 容器的角色**
   - 管理依赖的生命周期（注册、创建、缓存）。
   - 解析依赖关系（如 `userService` 依赖 `logger`）。

### **三、关键方法解析**

1. **`register(name, factory)`**

   - 注册一个依赖的工厂函数。
   - 每次调用 `get(name)` 时，都会执行工厂函数创建新实例。

2. **`singleton(name, factory)`**

   - 注册单例依赖，确保全局仅创建一个实例。
   - 首次调用 `get(name)` 时创建实例并缓存，后续直接返回缓存的实例。

3. **`get(name)`**
   - 获取依赖实例。
   - 自动递归解析所有依赖（如 `userService` 依赖 `logger`，容器会先解析 `logger`）。

### **四、进阶应用示例**

#### 1. **注册类依赖**

```javascript
class Database {
  constructor(config) {
    this.config = config;
  }
  connect() {
    console.log(`Connecting to ${this.config.url}`);
  }
}

container.register('dbConfig', () => ({ url: 'mongodb://localhost:27017' }));
container.register('database', (container) => {
  return new Database(container.get('dbConfig'));
});

const db = container.get('database');
db.connect(); // 输出: Connecting to mongodb://localhost:27017
```

#### 2. **处理异步依赖**

```javascript
container.register('httpClient', async (container) => {
  const config = await fetch('/api/config').then((res) => res.json());
  return {
    get: (url) => console.log(`Fetching ${url} with config ${config.apiKey}`),
  };
});

// 使用时需要异步获取
container.get('httpClient').then((client) => {
  client.get('/users');
});
```

### **五、IoC 的优势**

1. **解耦**

   - 对象无需依赖具体实现（如 `userService` 不依赖 `Logger` 的具体实现，仅依赖接口）。

2. **可测试性**

   - 测试时可轻松替换依赖（如用 `MockLogger` 替代真实的 `Logger`）。

3. **可维护性**

   - 依赖关系集中管理，修改一处即可影响全局。

4. **扩展性**
   - 新增依赖时，无需修改现有代码，只需在容器中注册。

### **六、与实际框架的对比**

- **Angular 的 DI 系统**：基于装饰器（`@Injectable`）和令牌（`InjectionToken`）实现更复杂的依赖注入。
- **NestJS 的 IoC 容器**：结合 TypeScript 类型系统，通过反射自动解析构造函数参数。
- **本示例**：简化版，手动注册和获取依赖，适合理解核心原理。

### **七、注意事项**

1. **循环依赖**

   - 若 A 依赖 B，B 又依赖 A，可能导致无限递归。需通过接口抽象或延迟注入解决。

2. **依赖顺序**

   - 注册顺序不影响解析，但需确保所有依赖都已注册。

3. **生命周期管理**
   - 单例模式可能导致内存泄漏，需谨慎使用。

### **总结**

IoC 容器通过将对象的创建和依赖管理交给外部容器，实现了松耦合和可测试性。上述示例展示了 IoC 的核心原理：注册依赖 → 解析依赖 → 注入依赖。在实际开发中，可根据需求扩展此容器，添加更复杂的生命周期管理、异步解析等功能。
