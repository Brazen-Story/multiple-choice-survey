import { Injectable } from '@nestjs/common';
import { CreateQuestionInput } from './dto/create-question.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Survey } from 'src/survey/survey.entity';
import { Repository } from 'typeorm';
import { SurveyService } from 'src/survey/survey.service';

@Injectable()
export class QuestionsService {
  constructor(@InjectRepository(Question) private questionRepository: Repository<Question>,
   private surveyService: SurveyService) { }

   async createQuestion(createQuestionInput: CreateQuestionInput): Promise<Question> {
    const survey = await this.getSurvey(createQuestionInput.surveyIdFk);
    if (!survey) {
      throw new Error('Survey not found');
    }
  
    const newQuestion = this.questionRepository.create({
      ...createQuestionInput,
      survey: survey
    });
  
    return this.questionRepository.save(newQuestion);
  }
  
  async findAll(): Promise<Question[]> {
    return this.questionRepository.find({
      relations: ['survey'],
    });
  }

  //질문 조회시 questionIdPk는 필수이나 surveyIdFk는 선택사항입니다.
  async findone(questionIdPk: string, surveyIdFk?: string): Promise<Question> {
    const whereCondition = surveyIdFk ? 
      {
        questionIdPk: questionIdPk,
        survey: { surveyIdPk: surveyIdFk }
      } : 
      {
        questionIdPk: questionIdPk
      };

    return this.questionRepository.findOneOrFail({
      where: whereCondition,
      relations: ['survey'],
    });
  }

  async remove(questionIdPk: string): Promise<void> {
    const question = await this.questionRepository.findOne({ where: { questionIdPk } });
    if (question) {
      await this.questionRepository.remove(question);
    } else {
      throw new Error('질문을 찾을 수 없습니다 !');
    }
  }

  async updateQuestion(questionIdPk: string, UpdateQuestionInput: Partial<Question>): Promise<Question> {
    await this.questionRepository.update(questionIdPk, UpdateQuestionInput);
    const updateQuestion = await this.questionRepository.findOne({ where: { questionIdPk: questionIdPk }});
    if(!updateQuestion) {
      throw new Error('Question not found');
    }
    return updateQuestion;
  }

  getSurvey(surveyId: string): Promise<Survey> {
    return this.surveyService.findone(surveyId)
  }
}

  // async findone(questionIdPk: string, surveyIdFk: string): Promise<Question> {
  //   return this.questionRepository.findOneOrFail({
  //     where: {
  //       questionIdPk: questionIdPk,
  //       survey: { surveyIdPk: surveyIdFk } // surveyIdPk는 Survey 엔티티의 기본 키 필드 이름입니다
  //     },
  //     relations: ['survey'],
  //   });

  // }