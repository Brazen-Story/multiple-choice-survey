import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AnswerService } from './answer.service';
import { Answer } from './entities/answer.entity';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';

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
  Answer(): Promise<Answer[]> {
    return this.answerService.findAll();
  }

  @Mutation(returns => Boolean)
  async removeAnswer(
    @Args('answerIdPk') answerIdPk: string
  ): Promise<boolean> {
    try {
      await this.answerService.remove(answerIdPk);
      return true;
    } catch (e) {
      // 에러 핸들링 로직, 예를 들어 GraphQL 에러를 throw 할 수 있습니다.
      throw new Error('응답을 찾을 수 없습니다 !');
    }
  }

  @Mutation(() => Answer)
  async updateAnswer(
    @Args('answerIdPk', { type: () => String }) answerIdPk: string,
    @Args('updateData') UpdateAnswerInput: UpdateAnswerInput,
  ): Promise<Answer> {
    return this.answerService.updateAnswer(answerIdPk, UpdateAnswerInput);
  }
}
