import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, IsInt } from 'class-validator';

@InputType()
export class CreateOptionInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  questionIdFk: string; // 관련된 Survey의 ID

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  number: number; // 질문 번호

  @Field()
  @IsString()
  @IsNotEmpty()
  content: string; //질문 내용

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  score: number; // 질문 번호
}
