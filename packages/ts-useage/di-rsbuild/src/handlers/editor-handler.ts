import { Hotkey, Inject } from '../container';
import { LoggerService } from '../services';

export class EditorHotkeys {
  // 属性注入
  @Inject(LoggerService)
  private logger!: LoggerService;

  // 构造函数注入（可选）
  constructor(@Inject(LoggerService) private anotherLogger: LoggerService) {
    this.anotherLogger.log('a');
  }

  // 注册单个热键
  @Hotkey('ctrl+s', {
    preventDefault: true,
  })
  handleSave(event: KeyboardEvent) {
    this.logger.log('触发保存操作');
    // 执行保存逻辑...
  }
}
