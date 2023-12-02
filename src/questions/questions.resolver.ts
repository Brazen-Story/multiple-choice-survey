import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';

@Resolver(of => Question)
export class QuestionsResolver {
  constructor(private questionsService: QuestionsService) { }

  //질문 만들기
  @Mutation(returns => Question)
  createQuestion(@Args('createQuestionInput') createQuestionInput: CreateQuestionInput): Promise<Question> {
    try {
      return this.questionsService.createQuestion(createQuestionInput);
    } catch (error) {
      throw error;
    }
  }

  //보고 싶은 질문 가져오기
  @Query(returns => Question)
  getQuestion(
    @Args('questionIdPk') questionIdPk: string,
    @Args('surveyIdFk', { nullable: true }) surveyIdFk?: string
  ): Promise<Question> {
    try {
      return this.questionsService.findone(questionIdPk, surveyIdFk);
    } catch (error) {
      throw error;
    }
  }

  //모든 질문들 가져오기
  @Query(returns => [Question])
  Question(): Promise<Question[]> {
    try {
      return this.questionsService.findAll();
    } catch (error) {
      throw error;
    }
  }

  //id와 일치하는 문항 업데이트
  @Mutation(() => Question)
  async updateQuestion(
    @Args('questionIdPk', { type: () => String }) questionIdPk: string,
    @Args('updateData') UpdateQuestionInput: UpdateQuestionInput,
  ): Promise<Question> {
    try {
      return this.questionsService.updateQuestion(questionIdPk, UpdateQuestionInput)
    } catch (error) {
      throw error;
    }
  }
  
  //id와 일치하는 문항 삭제
  @Mutation(returns => Boolean)
  async removeQuestion(@Args('questionIdPk') questionIdPk: string): Promise<boolean> {
    try {
      await this.questionsService.remove(questionIdPk);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
