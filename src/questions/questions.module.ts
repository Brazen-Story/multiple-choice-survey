import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsResolver } from './questions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { SurveyModule } from 'src/survey/survey.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question]),
    SurveyModule,
    LoggerModule,
  ],
  providers: [QuestionsResolver, QuestionsService],
  exports: [QuestionsService]
})
export class QuestionsModule {}
