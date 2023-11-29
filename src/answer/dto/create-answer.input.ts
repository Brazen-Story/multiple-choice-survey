import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsInt } from 'class-validator';

@InputType()
export class CreateAnswerInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  questionIdFk: string; // 관련된 Survey의 ID

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  number: number; // 사용자 응답 번호
}
