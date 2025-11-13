import { Hotkey, Inject, Injectable } from '../container';
import { LoggerService } from '../services';
import { HotkeyManager } from '../manager';

@Injectable()
export class Demo {
  // 属性注入
  @Inject(LoggerService)
  private logger!: LoggerService;

  // 构造函数注入
  constructor(@Inject(LoggerService) private anotherLogger: LoggerService) {
    this.anotherLogger.log('a');
  }

  // 注册单个热键
  // @Hotkey('$mod', {
  //   preventDefault: false,
  // })
  handleSave(event: KeyboardEvent) {
    console.log('🚀 ~ EditorHotkeys ~ handleSave ~ event:', 11111111);
  }
}
