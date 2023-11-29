import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AnswerService } from './answer.service';
import { Answer } from './entities/answer.entity';
import { CreateAnswerInput } from './dto/create-answer.input';

@Resolver(() => Answer)
export class AnswerResolver {
  constructor(private answerService: AnswerService) {}

  @Mutation(returns => Answer)
  createAnswer(@Args('createAnswerInput') createAnswerInput: CreateAnswerInput): Promise<Answer> {
    return this.answerService.createAnswer(createAnswerInput);
  }

  @Query(returns => Answer)
  getAnswer(
    @Args('answerIdPk') answerIdPk: string,
    @Args('questionIdFk') questionIdFk: string
  ): Promise<Answer> {
    return this.answerService.findone(answerIdPk, questionIdFk);
  }
  //모든 답변들 가져오기
  @Query(returns => [Answer])
  Question(): Promise<Answer[]> {
    return this.answerService.findAll();
  }

}
