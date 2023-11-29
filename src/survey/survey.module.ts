import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyResolver } from './survey.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './survey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Survey])],
  providers: [SurveyService, SurveyResolver],
  exports: [SurveyService]
})
export class SurveyModule {}
