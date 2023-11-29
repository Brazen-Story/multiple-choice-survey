import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { CreateQuestionInput } from './dto/create-question.input';

@Resolver(of => Question)
export class QuestionsResolver {
  constructor(private questionsService: QuestionsService) { }

  //질문 만들기
  @Mutation(returns => Question)
  createQuestion(@Args('createQuestionInput') createQuestionInput: CreateQuestionInput): Promise<Question> {
    return this.questionsService.createQuestion(createQuestionInput);
  }

  //보고 싶은 질문 가져오기
  @Query(returns => Question)
  getQuestion(
    @Args('questionIdPk') questionIdPk: string,
    @Args('surveyIdFk') surveyIdFk: string
  ): Promise<Question> {
    return this.questionsService.findone(questionIdPk, surveyIdFk);
  }
  
  //모든 질문들 가져오기
  @Query(returns => [Question])
  Question(): Promise<Question[]> {
    return this.questionsService.findAll();
  }

}
