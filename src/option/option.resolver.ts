import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OptionService } from './option.service';
import { Option } from './entities/option.entity';
import { CreateOptionInput } from './dto/create-option.input';

@Resolver(() => Option)
export class OptionResolver {
  constructor(private optionService: OptionService) { }

  @Mutation(returns => Option)
  createOption(@Args('createOptionInput') createOptionInput: CreateOptionInput): Promise<Option> {
    return this.optionService.createOption(createOptionInput);
  }

  @Query(returns => Option)
  getOption(
    @Args('optionIdPk') optionIdPk: string,
    @Args('questionIdFk') questionIdFk: string
  ): Promise<Option> {
    return this.optionService.findone(optionIdPk, questionIdFk);
  }

  //모든 질문들 가져오기
  @Query(returns => [Option])
  Question(): Promise<Option[]> {
    return this.optionService.findAll();
  }

  @Mutation(returns => Boolean)
  async removeOption(
    @Args('optionIdPk') optionIdPk: string
  ): Promise<boolean> {
    try {
      await this.optionService.remove(optionIdPk);
      return true;
    } catch (e) {
      // 에러 핸들링 로직, 예를 들어 GraphQL 에러를 throw 할 수 있습니다.
      throw new Error('선택지를 찾을 수 없습니다 !');
    }
  }
}