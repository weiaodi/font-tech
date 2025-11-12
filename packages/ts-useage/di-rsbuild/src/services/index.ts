export class LoggerService {
  log(message: string): void {
    console.log(`[Hotkey] ${message}`);
  }
}

// // 2. 注册服务到容器
// container.provide(LoggerService, LoggerService);
