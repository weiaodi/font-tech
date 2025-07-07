/* eslint-disable max-classes-per-file */
// 1. 定义接口（通过抽象基类实现）
class LoggerInterface {
  log(message) {
    throw new Error('log() method must be implemented');
  }
}

class DatabaseInterface {
  save(data) {
    throw new Error('save() method must be implemented');
  }
}

// 2. 具体实现（继承自接口）
class ConsoleLogger extends LoggerInterface {
  log(message) {
    console.log(`[CONSOLE] ${message}`);
  }
}

class MongoDatabase extends DatabaseInterface {
  constructor(url) {
    super();
    this.url = url;
  }

  save(data) {
    console.log(`Saving to MongoDB ${this.url}: ${JSON.stringify(data)}`);
    return { id: Date.now(), ...data };
  }
}

// 3. 依赖接口而非实现的服务
class UserService {
  constructor(logger, database) {
    // 验证依赖是否符合接口
    if (!(logger instanceof LoggerInterface)) {
      throw new Error('Logger must implement LoggerInterface');
    }

    if (!(database instanceof DatabaseInterface)) {
      throw new Error('Database must implement DatabaseInterface');
    }

    this.logger = logger;
    this.database = database;
  }

  createUser(name) {
    this.logger.log(`Creating user: ${name}`);
    const user = this.database.save({ name });
    return user;
  }
}

// 4. IoC 容器实现（增强版）
class Container {
  constructor() {
    this.dependencies = {};
    this.factories = {};
  }

  register(name, factory) {
    this.factories[name] = factory;
    return this;
  }

  get(name) {
    if (!this.factories[name]) {
      throw new Error(`Dependency ${name} not found`);
    }

    const instance = this.factories[name](this);

    // 接口验证（可根据需要扩展）
    if (name === 'logger' && !(instance instanceof LoggerInterface)) {
      throw new Error('Logger must implement LoggerInterface');
    }

    if (name === 'database' && !(instance instanceof DatabaseInterface)) {
      throw new Error('Database must implement DatabaseInterface');
    }

    return instance;
  }
}

// 5. 配置容器
const container = new Container();

container
  .register('logger', () => new ConsoleLogger())
  .register('database', (c) => new MongoDatabase('mongodb://localhost:27017'))
  .register('userService', (c) => new UserService(c.get('logger'), c.get('database')));

// 6. 使用示例
const userService = container.get('userService');
userService.createUser('Bob');
