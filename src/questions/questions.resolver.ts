import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { CreateQuestionInput } from './dto/create-question.input';

@Resolver(of => Question)
export class QuestionsResolver {
  constructor(private questionsService: QuestionsService) { }

  //질문 만들기
  @Mutation(returns => Question)
  createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput
  ): Promise<Question> {
    return this.questionsService.createQuestion(createQuestionInput);
  }

  //보고 싶은 질문 가져오기
  @Query(returns => Question)
  getQuestion(
    @Args('questionIdPk') questionIdPk: string,
    @Args('surveyIdFk', { nullable: true }) surveyIdFk?: string
  ): Promise<Question> {
    return this.questionsService.findone(questionIdPk, surveyIdFk);
  }

  //모든 질문들 가져오기
  @Query(returns => [Question])
  Question(): Promise<Question[]> {
    return this.questionsService.findAll();
  }

  @Mutation(returns => Boolean)
  async removeQuestion(
    @Args('questionIdPk') questionIdPk: string
  ): Promise<boolean> {
    try {
      await this.questionsService.remove(questionIdPk);
      return true;
    } catch (e) {
      // 에러 핸들링 로직, 예를 들어 GraphQL 에러를 throw 할 수 있습니다.
      // 
      throw new Error('질문을 찾을 수 없습니다 !');
    }
  }
}
