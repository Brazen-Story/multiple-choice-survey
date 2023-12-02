import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionResolver } from './option.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsModule } from 'src/questions/questions.module';
import { Option } from './entities/option.entity';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Option]),
  QuestionsModule,
  LoggerModule,
  ],
  providers: [OptionResolver, OptionService],
})
export class OptionModule {}
