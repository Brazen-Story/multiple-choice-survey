import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsResolver } from './questions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { SurveyModule } from 'src/survey/survey.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), SurveyModule],
  providers: [QuestionsResolver, QuestionsService],
  exports: [QuestionsService]
})
export class QuestionsModule {}
