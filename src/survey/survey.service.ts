import { Injectable } from '@nestjs/common';
import { Survey } from './survey.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSurveyInput } from './dto/create-survey.input';
import { Question } from 'src/questions/entities/question.entity';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ERROR_CODES, ERROR_MESSAGES } from '../errors/errors.constants';

@Injectable()
export class SurveyService {

  //저장소 주입, module.ts에 imports로 forFeature([survey])가 있는 경우
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    // 필요한 경우 다른 리포지토리를 주입
  ) { }

  //설문지 만들기
  createSurvey(CreateSurveyInput: CreateSurveyInput): Promise<Survey> {
    const newSurvey = this.surveyRepository.create(CreateSurveyInput);

    try {
      return this.surveyRepository.save(newSurvey);
    } catch (error) {
      throw new InternalServerErrorException({
        error: ERROR_CODES.INVALID_INPUT,
        message: ERROR_MESSAGES.INVALID_INPUT
      });
    }
  }

  //survey엔티티 찾기
  async findAll(): Promise<Survey[]> {
    try {
      const survery = await this.surveyRepository.find();
      return survery;
    } catch (error) {
      throw new NotFoundException({
        error: ERROR_CODES.SURVEY_NOT_FOUND,
        message: ERROR_MESSAGES.SURVEY_NOT_FOUND
      });
    }
  }

  //Id와 일치하는 엔티티 찾기
  async findone(surveyIdPk: string): Promise<Survey> {
    try {
      const survey = await this.surveyRepository.findOneOrFail({ where: { surveyIdPk } });
      return survey;
    } catch (error) {
      throw new NotFoundException({
        error: ERROR_CODES.SURVEY_NOT_FOUND,
        message: ERROR_MESSAGES.SURVEY_NOT_FOUND
      });
    }
  }

  //완성된 설문지 확인
  async getCompletedSurveys(): Promise<Survey[]> {
    try {
      const surveys = await this.surveyRepository.find({
        where: { state: '완료' },
        relations: ['questions', 'questions.options', 'questions.answers']
      });
      return surveys.map(survey => {
        survey.totalScore = this.calculateSurveyTotalScore(survey);
        return survey;
      });
    } catch (error) {
      throw new InternalServerErrorException({
        error: ERROR_CODES.GENERAL_ERROR,
        message: ERROR_MESSAGES.GENERAL_ERROR
      });
    }
  }

  //totalScore 점수
  private calculateSurveyTotalScore(survey: Survey): number {
    let totalScore = 0;
    survey.questions.forEach(question => {
      question.answers.forEach(answer => {
        const option = question.options.find(option => option.number === answer.number);
        if (option) {
          totalScore += option.score;
        }
      });
    });
    return totalScore;
  }

  // id와 일치하는 설문지 업데이트
  async updateSurvey(surveyIdPk: string, UpdateSurveyInput: Partial<Survey>): Promise<Survey> {
    try{
      const updateResult = await this.surveyRepository.update(surveyIdPk, UpdateSurveyInput);
      return this.findone(surveyIdPk);

    }catch (error) {
      throw new NotFoundException({
        error: ERROR_CODES.SURVEY_NOT_FOUND,
        message: ERROR_MESSAGES.SURVEY_NOT_FOUND
      });
    }
  }

  // id와 일치하는 설문지 제거
  async remove(surveyIdPk: string): Promise<void> {
    try{
      const survey = await this.surveyRepository.findOne({ where: { surveyIdPk } });
      await this.surveyRepository.remove(survey);
    }catch (error) {
      throw new NotFoundException({
        error: ERROR_CODES.SURVEY_NOT_FOUND,
        message: ERROR_MESSAGES.SURVEY_NOT_FOUND
      });
    }
  }

  //설문지 완료 API
  async checkCompletionAndSetState(surveyIdPk: string): Promise<Survey> {
    let survey: Survey;
    try {
      //먼저 설문지가 있는지 확인
      survey = await this.surveyRepository.findOne({ where: { surveyIdPk: surveyIdPk } });
      if (!survey) {
        throw new NotFoundException({
          error: ERROR_CODES.SURVEY_NOT_FOUND,
          message: ERROR_MESSAGES.SURVEY_NOT_FOUND
        });
      }

      //질문에 대한 대답이 있는지 확인
      const questions = await this.questionRepository.find({
        where: { survey: { surveyIdPk: surveyIdPk } },
        relations: ['answers'],
      });

      //모든 질문에 답변이 있는지 확인
      const isComplete = questions.every(question => question.answers.length > 0);

      //모든 질문에 대답이 있는지 설문조사 확인 후 완료로 업데이트
      if (isComplete) {
        await this.surveyRepository.update(surveyIdPk, { state: '완료' });
      }

      return survey;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        error: ERROR_CODES.GENERAL_ERROR,
        message: ERROR_MESSAGES.GENERAL_ERROR
      });
    }
  }

}
