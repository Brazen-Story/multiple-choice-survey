import { IsInt, IsString } from 'class-validator';
import { CreateOptionInput } from './create-option.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOptionInput extends PartialType(CreateOptionInput) {
  @Field({ nullable: true })
  @IsString()
  content: string; //질문 내용

  @Field(() => Int, { nullable: true })
  @IsInt()
  score: number; // 질문 점수
}
