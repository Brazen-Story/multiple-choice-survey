import { Args, Mutation,  Query, Resolver } from '@nestjs/graphql';
import { Survey } from './survey.entity';
import { SurveyService } from './survey.service';
import { CreateSurveyInput } from './dto/create-survey.input';
import { UpdateSurveyInput } from './dto/update-surveyinput';

@Resolver((of) => Survey)
export class SurveyResolver {
  constructor(private surveyService: SurveyService) { }

  //설문지만들기
  @Mutation(returns => Survey)
  createSurvey(@Args('CreateSurveyInput') CreateSurveyInput: CreateSurveyInput): Promise<Survey> {
    return this.surveyService.createSurvey(CreateSurveyInput);
  }

  //survey엔티티 찾기
  @Query(returns => [Survey])
  Survey(): Promise<Survey[]> {
    return this.surveyService.findAll();
  }

  //Id와 일치하는 엔티티 찾기
  @Query(returns => Survey)
  getSurvey(@Args('surveyIdPk') surveyIdPk: string): Promise<Survey> {
    return this.surveyService.findone(surveyIdPk)
  }  

  //완성된 설문지 확인
  @Query(() => [Survey])
  async getCompletedSurveys() {
    return this.surveyService.getCompletedSurveys();
  }

  //설문지 업데이트
  @Mutation(() => Survey)
  async updateSurvey(
    @Args('surveyIdPk', { type: () => String }) surveyIdPk: string,
    @Args('updateData') UpdateSurveyInput: UpdateSurveyInput,
  ): Promise<Survey> {
    return this.surveyService.updateSurvey(surveyIdPk, UpdateSurveyInput);
  }

  //설문지 제거
  @Mutation(returns => Boolean)
  async removeSurvey(
    @Args('surveyIdPk') surveyIdPk: string
  ): Promise<boolean> {
    try {
      await this.surveyService.remove(surveyIdPk);
      return true;
    } catch (e) {
      throw new Error('선택지를 찾을 수 없습니다 !');
    }
  }

  //완료로 변경해줌.
  @Mutation(() => Survey)
  async completeSurvey(
    @Args('surveyIdPk') surveyIdPk: string,
  ): Promise<Survey> {
    return this.surveyService.checkCompletionAndSetState(surveyIdPk);
  }
}
