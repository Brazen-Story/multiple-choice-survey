import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Survey } from './entities/survey.entity';
import { SurveyService } from './survey.service';
import { CreateSurveyInput } from './dto/create-survey.input';
import { UpdateSurveyInput } from './dto/update-surveyinput';

@Resolver(() => Survey)
export class SurveyResolver {
  constructor(private surveyService: SurveyService) { }

  //설문지 만들기
  @Mutation(() => Survey)
  async createSurvey(@Args('CreateSurveyInput') CreateSurveyInput: CreateSurveyInput): Promise<Survey> {
    try {
      return await this.surveyService.createSurvey(CreateSurveyInput);
    } catch (error) {
      throw error;
    }
  }

  //모든 설문지 엔티티 찾기
  @Query(() => [Survey])
  async Survey(): Promise<Survey[]> {
    try {
      return await this.surveyService.findAll();
    } catch (error) {
      throw error;
    }
  }

  //id와 일치하는 엔티티 찾기
  @Query(() => Survey)
  async getSurvey(@Args('surveyIdPk') surveyIdPk: string): Promise<Survey> {
    try {
      return await this.surveyService.findone(surveyIdPk);
    } catch (error) {
      throw error;
    }
  }

  //완성된 설문지 확인
  @Query(() => [Survey])
  async getCompletedSurveys() {
    try {
      return await this.surveyService.getCompletedSurveys();
    } catch (error) {
      throw error;
    }
  }

  //id와 일치하는 설문지 업데이트
  @Mutation(() => Survey)
  async updateSurvey(
    @Args('surveyIdPk', { type: () => String }) surveyIdPk: string,
    @Args('updateData') UpdateSurveyInput: UpdateSurveyInput,
  ): Promise<Survey> {
    try {
      return await this.surveyService.updateSurvey(surveyIdPk, UpdateSurveyInput);
    } catch (error) {
      throw error;
    }
  }

  // id와 일치하는 설문지 제거
  @Mutation(() => Boolean)
  async removeSurvey(@Args('surveyIdPk') surveyIdPk: string): Promise<boolean> {
    try {
      await this.surveyService.remove(surveyIdPk);
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  //설문지 완료 API
  @Mutation(() => Survey)
  async completeSurvey(@Args('surveyIdPk') surveyIdPk: string): Promise<Survey> {
    try {
      return await this.surveyService.checkCompletionAndSetState(surveyIdPk);
    } catch (error) {
      throw error;
    }
  }
}
