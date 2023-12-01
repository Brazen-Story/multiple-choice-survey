import { IsInt, IsString } from 'class-validator';
import { CreateQuestionInput } from './create-question.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateQuestionInput extends PartialType(CreateQuestionInput) {
  @Field(() => Int, {nullable: true})
  @IsInt()
  number: number; // 질문 번호

  @Field({ nullable: true })
  @IsString()
  title: string; //질문 내용
}
