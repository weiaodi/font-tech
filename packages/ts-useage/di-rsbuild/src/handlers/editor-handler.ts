import { Hotkey, Inject, Injectable } from '../container';
import { LoggerService } from '../services';

@Injectable()
export class EditorHotkeys {
  // 属性注入
  @Inject(LoggerService)
  private logger!: LoggerService;

  // 构造函数注入（可选）
  constructor(@Inject(LoggerService) private anotherLogger: LoggerService) {
    this.anotherLogger.log('a');
  }

  // 注册单个热键
  @Hotkey('s', '保存', '操作', {
    preventDefault: false,
  })
  handleSave(event: KeyboardEvent) {
    console.log('🚀 ~ EditorHotkeys ~ handleSave ~ event:', this);
    this.logger.log('触发保存操作');
    // 执行保存逻辑...
  }

  @Hotkey('$mod+k k', '测试', '操作', {
    preventDefault: true,
    stopPropagation: true,
  })
  handleSave1(event: KeyboardEvent) {
    console.log('🚀 ~ EditorHotkeys ~ handleSave ~ event:', event);

    // 执行保存逻辑...
  }
}
