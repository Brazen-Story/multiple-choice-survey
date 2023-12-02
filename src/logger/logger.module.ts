import { Module } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService]
})
export class LoggerModule {}
