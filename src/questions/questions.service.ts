import { Injectable } from '@nestjs/common';
import { CreateQuestionInput } from './dto/create-question.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Survey } from 'src/survey/survey.entity';
import { Repository } from 'typeorm';
import { SurveyService } from 'src/survey/survey.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ERROR_CODES, ERROR_MESSAGES } from '../errors/errors.constants';

@Injectable()
export class QuestionsService {
  constructor(@InjectRepository(Question) private questionRepository: Repository<Question>,
    private surveyService: SurveyService) { }

  //문항 만들기
  async createQuestion(createQuestionInput: CreateQuestionInput): Promise<Question> {
    try {
      const survey = await this.getSurvey(createQuestionInput.surveyIdFk);
      if (!survey) {
        throw new NotFoundException({
          error: ERROR_CODES.SURVEY_NOT_FOUND,
          message: ERROR_MESSAGES.SURVEY_NOT_FOUND
        });
      }

      const newQuestion = this.questionRepository.create({
        ...createQuestionInput,
        survey: survey
      });

      return await this.questionRepository.save(newQuestion);
    } catch (error) {
      throw new InternalServerErrorException({
        error: ERROR_CODES.GENERAL_ERROR,
        message: ERROR_MESSAGES.GENERAL_ERROR
      });
    }
  }

  //문항 엔티티 찾기
  async findAll(): Promise<Question[]> {
    try {
      return await this.questionRepository.find({ relations: ['survey'] });
    } catch (error) {
      throw new InternalServerErrorException({
        error: ERROR_CODES.GENERAL_ERROR,
        message: ERROR_MESSAGES.GENERAL_ERROR
      });
    }
  }

  //질문 조회시 questionIdPk는 필수이나 surveyIdFk는 선택사항입니다.
  async findone(questionIdPk: string, surveyIdFk?: string): Promise<Question> {
    try {
      const whereCondition = surveyIdFk ?
        { questionIdPk, survey: { surveyIdPk: surveyIdFk } } :
        { questionIdPk };

      return await this.questionRepository.findOneOrFail({
        where: whereCondition,
        relations: ['survey'],
      });
    } catch (error) {
      throw new NotFoundException({
        error: ERROR_CODES.QUESTION_NOT_FOUND,
        message: ERROR_MESSAGES.QUESTION_NOT_FOUND
      });
    }
  }

  //id와 일치하는 문항 업데이트
  async updateQuestion(questionIdPk: string, UpdateQuestionInput: Partial<Question>): Promise<Question> {
    try {
      await this.questionRepository.update(questionIdPk, UpdateQuestionInput);
      const updatedQuestion = await this.questionRepository.findOne({ where: { questionIdPk } });
      return updatedQuestion;
    } catch (error) {
      throw new NotFoundException({
        error: ERROR_CODES.QUESTION_NOT_FOUND,
        message: ERROR_MESSAGES.QUESTION_NOT_FOUND
      });
    }
  }

  //id와 일치하는 문항 삭제
  async remove(questionIdPk: string): Promise<void> {
    try {
      const question = await this.questionRepository.findOne({ where: { questionIdPk } });
      await this.questionRepository.remove(question);

    } catch (error) {
      throw new NotFoundException({
        error: ERROR_CODES.QUESTION_NOT_FOUND,
        message: ERROR_MESSAGES.QUESTION_NOT_FOUND
      });
    }
  }

  async getSurvey(surveyId: string): Promise<Survey> {
    try {
      return await this.surveyService.findone(surveyId);
    } catch (error) {
      throw new NotFoundException({
        error: ERROR_CODES.SURVEY_NOT_FOUND,
        message: ERROR_MESSAGES.SURVEY_NOT_FOUND
      });
    }
  }
}