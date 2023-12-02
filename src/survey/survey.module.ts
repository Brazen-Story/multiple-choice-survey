import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyResolver } from './survey.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './survey.entity';
import { Question } from 'src/questions/entities/question.entity';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, Question]), LoggerModule],
  providers: [SurveyService, SurveyResolver],
  exports: [SurveyService]
})
export class SurveyModule {}
