import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Survey } from './survey.entity';
import { SurveyService } from './survey.service';
import { createSurveyInput } from './dto/create-survey.input';
import { Question } from 'src/questions/entities/question.entity';

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
}
