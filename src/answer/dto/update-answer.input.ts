import { IsInt } from 'class-validator';
import { CreateAnswerInput } from './create-answer.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAnswerInput extends PartialType(CreateAnswerInput) {
  @Field(() => Int, { nullable: true})
  @IsInt()
  number: number; // 사용자 응답 번호
}
