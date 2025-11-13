import 'reflect-metadata';
import { HotkeyManager } from './manager';
import { EditorHotkeys } from './handlers/editor-handler';
import { Demo } from './handlers/demo-handler';
import { Container } from './container';
// import { registerAllServices } from './di/registry';

function bootstrap() {
  // 注册热键处理类
  HotkeyManager.registerHotkeys(EditorHotkeys);
  HotkeyManager.registerHotkeys(Demo);
  Container.getInstance().getRegisteredHotkeys();
  console.log(
    '🚀 ~ bootstrap ~  Container.getInstance().getRegisteredHotkeys():',
    Container.getInstance().getRegisteredHotkeys(),
  );
}

// 启动应用
bootstrap();
