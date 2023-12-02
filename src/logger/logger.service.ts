import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {

  logError(context: string, error: string, trace: string) {
    this.error(`[${context}] Error: ${error}`, trace);
  }

  logVerbose(operation: string, details: string, context: string) {
    this.verbose(`[${context}] ${operation}: ${details}`);
  }

}

