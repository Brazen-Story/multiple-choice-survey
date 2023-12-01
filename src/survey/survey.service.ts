import { Injectable } from '@nestjs/common';
import { Survey } from './survey.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSurveyInput } from './dto/create-survey.input';
import { Question } from 'src/questions/entities/question.entity';

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

    return this.surveyRepository.save(newSurvey);
  }

  //survey엔티티 찾기
  async findAll(): Promise<Survey[]> {
    return this.surveyRepository.find();
  }

  //Id와 일치하는 엔티티 찾기
  findone(surveyIdPk: string): Promise<Survey> {
    return this.surveyRepository.findOneOrFail({ where: { surveyIdPk } });
  }

  //완성된 설문지 확인
  async getCompletedSurveys(): Promise<Survey[]> {
    const surveys = await this.surveyRepository.find({
      where: { state: '완료' },
      relations: ['questions', 'questions.options', 'questions.answers']
    });

    return surveys.map(survey => {
      survey.totalScore = this.calculateSurveyTotalScore(survey);
      return survey;
    });
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

  //설문지 업데이트
  async updateSurvey(surveyIdPk: string, UpdateSurveyInput: Partial<Survey>): Promise<Survey> {
    await this.surveyRepository.update(surveyIdPk, UpdateSurveyInput);
    const updatedSurvey = await this.surveyRepository.findOne({ where: { surveyIdPk: surveyIdPk } });
    if (!updatedSurvey) {
      throw new Error('Survey not found');
    }
    return updatedSurvey;
  }

  //설문지 제거
  async remove(surveyIdPk: string): Promise<void> {
    const survey = await this.surveyRepository.findOne({ where: { surveyIdPk } });
    if (survey) {
      await this.surveyRepository.remove(survey);
    } else {
      throw new Error('선택지를 찾을 수 없습니다 !');
    }
  }

  //설문지 완료 API
  async checkCompletionAndSetState(surveyIdPk: string): Promise<Survey> {
    // 모든 질문에 대한 답변이 있는지 확인
    const questions = await this.questionRepository.find({
      where: { survey: { surveyIdPk: surveyIdPk } }, // 'surveyIdPk' 필드를 사용하여 필터링
      relations: ['answers'],
    });

    // 모든 질문에 답변이 있는지 여부를 확인
    const isComplete = questions.every(question => question.answers.length > 0);

    if (isComplete) {
      // 모든 질문에 대한 답변이 있다면 설문조사의 상태를 '완성'으로 업데이트
      await this.surveyRepository.update(surveyIdPk, { state: '완료' });
    }

    // 업데이트된 설문조사를 반환
    return this.surveyRepository.findOne({ where: { surveyIdPk: surveyIdPk } });
  }
}
