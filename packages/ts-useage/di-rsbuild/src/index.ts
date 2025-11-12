import 'reflect-metadata';
import { HotkeyManager } from './manager';
import { EditorHotkeys } from './handlers/editor-handler';

function bootstrap() {
  // 初始化热键系统
  HotkeyManager.init();

  // 注册热键处理类
  HotkeyManager.registerHotkeys(EditorHotkeys);

  // // 切换作用域（示例）
  // setTimeout(() => {
  //   HotkeyManager.setScope('textEditor');
  //   console.log('热键作用域切换到：textEditor');
  // }, 3000);

  // // 打印所有热键信息
  // console.log('已注册热键：', HotkeyManager.getHotkeyInfo());
}

// 启动应用
bootstrap();
