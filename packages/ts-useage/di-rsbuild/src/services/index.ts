import { Injectable } from '../container';

@Injectable()
export class LoggerService {
  log(message: string): void {
    console.log(`日志服务[Hotkey] ${message}`);
  }
}
