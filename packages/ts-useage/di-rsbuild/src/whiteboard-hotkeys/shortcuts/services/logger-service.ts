// import { Injectable } from '../di';

/**
 * todo: 快捷键插件系统的基础服务，目前还不需要，待定添加
 * 跟进人: 魏奥迪
 * 预计解决时间：
 */
// @Injectable()
export class LoggerService {
  log(message: string): void {
    console.log(`日志服务[Hotkey] ${message}`);
  }
}
