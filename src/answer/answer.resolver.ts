import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AnswerService } from './answer.service';
import { Answer } from './entities/answer.entity';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';

@Resolver(() => Answer)
export class AnswerResolver {
  constructor(private answerService: AnswerService) { }

  //응답 만들기
  @Mutation(returns => Answer)
  createAnswer(@Args('createAnswerInput') createAnswerInput: CreateAnswerInput): Promise<Answer> {
    try {
      return this.answerService.createAnswer(createAnswerInput);
    } catch (error) {
      throw error;
    }
  }

  //모든 응답 엔티티 찾기
  @Query(returns => [Answer])
  Answer(): Promise<Answer[]> {
    try {
      return this.answerService.findAll();
    } catch (error) {
      throw error;
    }
  }

  //id 일치하는 응답 엔티티 찾기
  @Query(returns => Answer)
  getAnswer(
    @Args('answerIdPk') answerIdPk: string,
    @Args('questionIdFk') questionIdFk: string
  ): Promise<Answer> {
    try {
      return this.answerService.findone(answerIdPk, questionIdFk);
    } catch (error) {
      throw error;
    }
  }

  //id 일치하는 응답 업데이트
  @Mutation(() => Answer)
  async updateAnswer(
    @Args('answerIdPk', { type: () => String }) answerIdPk: string,
    @Args('updateData') UpdateAnswerInput: UpdateAnswerInput,
  ): Promise<Answer> {
    try {
      return this.answerService.updateAnswer(answerIdPk, UpdateAnswerInput);
    } catch (error) {
      throw error;
    }
  }

  //id 일치하는 응답 삭제
  @Mutation(returns => Boolean)
  async removeAnswer(@Args('answerIdPk') answerIdPk: string): Promise<boolean> {
    try {
      await this.answerService.remove(answerIdPk);
      return true;
    } catch (error) {
      // 에러 핸들링 로직, 예를 들어 GraphQL 에러를 throw 할 수 있습니다.
      throw error;
    }
  }
}
