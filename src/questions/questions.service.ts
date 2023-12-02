import { Injectable } from '@nestjs/common';
import { CreateQuestionInput } from './dto/create-question.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Survey } from 'src/survey/survey.entity';
import { Repository } from 'typeorm';
import { SurveyService } from 'src/survey/survey.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ERROR_CODES, ERROR_MESSAGES } from '../errors/errors.constants';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class QuestionsService {
  constructor(@InjectRepository(Question) private questionRepository: Repository<Question>,
    private surveyService: SurveyService,
    private logger: LoggerService) { }

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

      this.logger.logVerbose('Create', `${createQuestionInput.surveyIdFk}에 사용할 문항을 만들었습니다.`, QuestionsService.name);
      return await this.questionRepository.save(newQuestion);
    } catch (error) {
      this.logger.logError(LoggerService.name, ERROR_CODES.GENERAL_ERROR, error.stack);

      throw new InternalServerErrorException({
        error: ERROR_CODES.GENERAL_ERROR,
        message: ERROR_MESSAGES.GENERAL_ERROR
      });
    }
  }

  //문항 엔티티 찾기
  async findAll(): Promise<Question[]> {
    try {
      this.logger.logVerbose('Read', `모든 문항 목록을 찾았습니다.`, QuestionsService.name);
      return await this.questionRepository.find({ relations: ['survey'] });
    } catch (error) {
      this.logger.logError(LoggerService.name, ERROR_CODES.QUESTION_NOT_FOUND, error.stack);

      throw new NotFoundException({
        error: ERROR_CODES.QUESTION_NOT_FOUND,
        message: ERROR_MESSAGES.QUESTION_NOT_FOUND
      });
    }
  }

  //질문 조회시 questionIdPk는 필수이나 surveyIdFk는 선택사항입니다.
  async findone(questionIdPk: string, surveyIdFk?: string): Promise<Question> {
    try {
      const whereCondition = surveyIdFk ?
        { questionIdPk, survey: { surveyIdPk: surveyIdFk } } :
        { questionIdPk };

      this.logger.logVerbose('Read', `${questionIdPk} 문항을 찾았습니다.`, QuestionsService.name);
      return await this.questionRepository.findOneOrFail({
        where: whereCondition,
        relations: ['survey'],
      });
    } catch (error) {
      this.logger.logError(LoggerService.name, ERROR_CODES.QUESTION_NOT_FOUND, error.stack);

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

      this.logger.logVerbose('Update', `${questionIdPk} 문항을 업데이트 했습니다.`, QuestionsService.name);
      return updatedQuestion;
    } catch (error) {
      this.logger.logError(LoggerService.name, ERROR_CODES.QUESTION_NOT_FOUND, error.stack);

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
      this.logger.logVerbose('Delete', `${questionIdPk} 문항을 삭제 했습니다.`, QuestionsService.name);
    } catch (error) {
      this.logger.logError(LoggerService.name, ERROR_CODES.QUESTION_NOT_FOUND, error.stack);

      throw new NotFoundException({
        error: ERROR_CODES.QUESTION_NOT_FOUND,
        message: ERROR_MESSAGES.QUESTION_NOT_FOUND
      });
    }
  }

  async getSurvey(surveyId: string): Promise<Survey> {
    try {
      this.logger.logVerbose('Read', `${surveyId} 설문지를 찾았습니다.`, QuestionsService.name);
      return await this.surveyService.findone(surveyId);
    } catch (error) {
      this.logger.logError(LoggerService.name, ERROR_CODES.SURVEY_NOT_FOUND, error.stack);

      throw new NotFoundException({
        error: ERROR_CODES.SURVEY_NOT_FOUND,
        message: ERROR_MESSAGES.SURVEY_NOT_FOUND
      });
    }
  }
}