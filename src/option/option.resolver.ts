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

}