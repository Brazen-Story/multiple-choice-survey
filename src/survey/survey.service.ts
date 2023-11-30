import { Injectable } from '@nestjs/common';
import { Survey } from './survey.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createSurveyInput } from './dto/create-survey.input';
import { UpdateAnswerInput } from 'src/answer/dto/update-answer.input';

@Injectable()
export class SurveyService {
    //저장소 주입, module.ts에 imports로 forFeature([survey])가 있는 경우
    constructor(@InjectRepository(Survey) private surveyRepository: Repository<Survey>) {}

    createSurvey(createSurveyInput: createSurveyInput): Promise<Survey> {
        
        const newSurvey = this.surveyRepository.create(createSurveyInput);
        
        return this.surveyRepository.save(newSurvey);
    }

    async findAll(): Promise<Survey[]> {
        return this.surveyRepository.find();
    }

    findone(surveyIdPk: string): Promise<Survey> {
        return this.surveyRepository.findOneOrFail({ where: { surveyIdPk } });
    }

    async remove(surveyIdPk: string): Promise<void> {
        const survey = await this.surveyRepository.findOne({ where: { surveyIdPk } });
        if (survey) {
          await this.surveyRepository.remove(survey);
        } else {
          throw new Error('선택지를 찾을 수 없습니다 !');
        }
      }

      async updateSurvey(surveyIdPk: string, UpdateSurveyInput: Partial<Survey>): Promise<Survey> {
        await this.surveyRepository.update(surveyIdPk, UpdateSurveyInput);
        const updatedSurvey = await this.surveyRepository.findOne({ where: { surveyIdPk: surveyIdPk } });
        if (!updatedSurvey) {
          throw new Error('Survey not found');
        }
        return updatedSurvey;
      }
}
