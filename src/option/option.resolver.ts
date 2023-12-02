import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OptionService } from './option.service';
import { Option } from './entities/option.entity';
import { CreateOptionInput } from './dto/create-option.input';
import { UpdateOptionInput } from './dto/update-option.input';

@Resolver(() => Option)
export class OptionResolver {
  constructor(private optionService: OptionService) { }

  //옵션 만들기
  @Mutation(returns => Option)
  createOption(@Args('createOptionInput') createOptionInput: CreateOptionInput): Promise<Option> {
    try {
      return this.optionService.createOption(createOptionInput);
    } catch (error) {
      throw error;
    }
  }

  //id 일치하는 옵션 엔티티 찾기
  @Query(returns => Option)
  getOption(
    @Args('optionIdPk') optionIdPk: string,
    @Args('questionIdFk') questionIdFk: string
  ): Promise<Option> {
    try {
      return this.optionService.findone(optionIdPk, questionIdFk);
    } catch (error) {
      throw error;
    }
  }

  //모든 옵션 엔티티 찾기
  @Query(returns => [Option])
  Option(): Promise<Option[]> {
    try {
      return this.optionService.findAll();
    } catch (error) {
      throw error;
    }
  }

  //id 일치하는 옵션 엔티티 업데이트
  @Mutation(() => Option)
  async updateOption(
    @Args('optionIdPk', { type: () => String }) optionIdPk: string,
    @Args('updateData') UpdateOptionInput: UpdateOptionInput,
  ): Promise<Option> {
    try {
      return this.optionService.updateOption(optionIdPk, UpdateOptionInput);
    } catch (error) {
      throw error;
    }
  }

  //id일치하는 옵션 제거
  @Mutation(returns => Boolean)
  async removeOption(@Args('optionIdPk') optionIdPk: string): Promise<boolean> {
    try {
      await this.optionService.remove(optionIdPk);
      return true;
    } catch (error) {
      throw error;
    }
  }
}