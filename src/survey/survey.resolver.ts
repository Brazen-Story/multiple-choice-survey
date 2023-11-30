import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Survey } from './survey.entity';
import { SurveyService } from './survey.service';
import { createSurveyInput } from './dto/create-survey.input';
import { Question } from 'src/questions/entities/question.entity';
import { UpdateSurveyInput } from './dto/update-question.input';

@Resolver((of) => Survey)
export class SurveyResolver {
  constructor(private surveyService: SurveyService) { }

  @Mutation(returns => Survey)
  createSurvey(@Args('createSurveyInput') createSurveyInput: createSurveyInput): Promise<Survey> {
    return this.surveyService.createSurvey(createSurveyInput);
  }

  @Query(returns => Survey)
  getSurvey(@Args('surveyIdPk') surveyIdPk: string): Promise<Survey> {
    return this.surveyService.findone(surveyIdPk)
  }

  @Query(returns => [Survey])
  survey(): Promise<Survey[]> {
    return this.surveyService.findAll();
  }

  @Mutation(returns => Boolean)
  async removeSurvey(
    @Args('surveyIdPk') surveyIdPk: string
  ): Promise<boolean> {
    try {
      await this.surveyService.remove(surveyIdPk);
      return true;
    } catch (e) {
      // 에러 핸들링 로직, 예를 들어 GraphQL 에러를 throw 할 수 있습니다.
      throw new Error('선택지를 찾을 수 없습니다 !');
    }
  }

  @Mutation(() => Survey)
  async updateSurvey(
    @Args('surveyIdPk', { type: () => String }) surveyIdPk: string,
    @Args('updateData') UpdateSurveyInput: UpdateSurveyInput,
  ): Promise<Survey> {
    return this.surveyService.updateSurvey(surveyIdPk, UpdateSurveyInput);
  }
}
