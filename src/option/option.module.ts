import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionResolver } from './option.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsModule } from 'src/questions/questions.module';
import { Option } from './entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Option]), QuestionsModule],
  providers: [OptionResolver, OptionService],
})
export class OptionModule {}
