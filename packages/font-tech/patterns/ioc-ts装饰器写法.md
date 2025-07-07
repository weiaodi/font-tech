### **一、装饰器实现依赖注入**

```typescript
// 1. 定义 Injectable 装饰器（标记可注入的服务）
function Injectable(): ClassDecorator {
  return (target: Function) => {
    // 为类添加元数据，标记其为可注入服务
    Reflect.defineMetadata('design:injectable', true, target);
  };
}

// 2. 定义 Inject 装饰器（指定依赖项）
function Inject(token: any): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    // 存储参数位置对应的依赖 token
    const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
    tokens[parameterIndex] = token;
    Reflect.defineMetadata('design:paramtypes', tokens, target);
  };
}

// 3. 依赖注入容器实现
class Container {
  private instances = new Map<any, any>();

  // 注册服务
  register(token: any, implementation: any) {
    this.instances.set(token, new implementation());
    return this;
  }

  // 解析依赖
  get<T>(token: any): T {
    if (!this.instances.has(token)) {
      throw new Error(`Service ${token.name} not registered`);
    }
    return this.instances.get(token) as T;
  }

  // 创建实例（处理构造函数注入）
  create<T>(target: Function): T {
    // 获取构造函数参数的依赖 tokens
    const tokens = Reflect.getMetadata('design:paramtypes', target) || [];

    // 递归解析所有依赖
    const dependencies = tokens.map((token) => this.get(token));

    // 使用解析出的依赖创建实例
    return new target(...dependencies);
  }
}
```

### **二、应用场景示例**

```typescript
// 4. 定义接口（抽象依赖）
interface Logger {
  log(message: string): void;
}

// 5. 具体实现
@Injectable() // 标记为可注入服务
class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(`[CONSOLE] ${message}`);
  }
}

@Injectable()
class FileLogger implements Logger {
  constructor(private filePath: string) {}

  log(message: string) {
    console.log(`[FILE] ${this.filePath}: ${message}`);
  }
}

// 6. 服务类（依赖 Logger）
@Injectable()
class UserService {
  constructor(
    @Inject(ConsoleLogger) private logger: Logger, // 指定注入的依赖
  ) {}

  createUser(name: string) {
    this.logger.log(`Creating user: ${name}`);
    return { id: Date.now(), name };
  }
}

// 7. 配置容器
const container = new Container();
container
  .register(ConsoleLogger, ConsoleLogger)
  .register(FileLogger, () => new FileLogger('/var/log/app.log'))
  .register(UserService, UserService);

// 8. 使用容器创建实例
const userService = container.create(UserService);
userService.createUser('Alice'); // 输出: [CONSOLE] Creating user: Alice
```

### **三、关键机制解析**

1. **装饰器的作用**：

   - `@Injectable()`：标记类为可注入的服务，允许容器管理其生命周期。
   - `@Inject(token)`：显式指定构造函数参数的依赖 token，解决类型擦除问题。

2. **元数据反射（Reflect Metadata）**：

   - 使用 `Reflect.defineMetadata` 和 `Reflect.getMetadata` 存储和读取类的元数据。
   - 元数据包含：
     - 类是否可注入（`design:injectable`）
     - 构造函数参数的依赖类型（`design:paramtypes`）

3. **控制反转的体现**：

   - `UserService` 不主动创建 `Logger`，而是声明依赖（控制反转）。
   - 容器负责创建 `Logger` 实例并注入到 `UserService`（依赖注入）。

4. **依赖注入的方式**：
   - **构造函数注入**：通过构造函数参数注入依赖（最常用）。
   - **属性注入**：通过装饰器直接注入到类属性（需额外实现）。

### **四、进阶特性**

#### 1. **命名依赖（Named Injection）**

```typescript
const LOGGER_TOKEN = Symbol('logger');

container.register(LOGGER_TOKEN, ConsoleLogger);

class AppService {
  constructor(@Inject(LOGGER_TOKEN) private logger: Logger) {}
}
```

#### 2. **生命周期管理**

```typescript
enum Scope {
  SINGLETON, // 单例（默认）
  TRANSIENT, // 每次请求新实例
}

@Injectable({ scope: Scope.TRANSIENT })
class TransientService {}
```

#### 3. **异步依赖解析**

```typescript
async getAsync<T>(token: any): Promise<T> {
  if (this.instances.has(token)) {
    return this.instances.get(token);
  }

  // 异步创建依赖
  const instance = await this.factoryRegistry[token]();
  this.instances.set(token, instance);
  return instance;
}
```

### **五、实际框架中的应用**

1. **Angular 框架**：

   ```typescript
   @Injectable()
   export class AuthService {
     constructor(private http: HttpClient) {}
   }

   @Component({
     providers: [AuthService],
   })
   export class UserComponent {
     constructor(private auth: AuthService) {}
   }
   ```

2. **NestJS 框架**：
   ```typescript
   @Injectable()
   export class CatsService {
     constructor(
       @InjectRepository(Cat)
       private catsRepository: Repository<Cat>,
     ) {}
   }
   ```

### **六、装饰器实现依赖注入的优势**

1. **强类型支持**：通过 TypeScript 类型系统，确保注入的依赖类型正确。
2. **声明式语法**：使用装饰器直观地标记依赖关系。
3. **框架集成**：与 Angular、NestJS 等现代框架无缝对接。
4. **测试友好**：可轻松替换为 mock 实现进行单元测试。

### **总结**

通过装饰器实现的依赖注入和控制反转，将对象的创建和依赖关系管理从代码中抽离到容器，使代码更易维护、测试和扩展。核心在于：

1. **装饰器标记依赖关系**
2. **元数据反射存储依赖信息**
3. **容器负责依赖解析和实例化**
