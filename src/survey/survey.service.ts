import { Injectable } from '@nestjs/common';
import { Survey } from './survey.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createSurveyInput } from './dto/create-survey.input';

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
}
