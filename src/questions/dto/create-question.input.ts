import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, IsInt } from 'class-validator';

@InputType()
export class CreateQuestionInput {
    @Field(() => ID)
    @IsUUID()
    @IsNotEmpty()
    surveyIdFk: string; // 관련된 Survey의 ID

    @Field(() => Int)
    @IsInt()
    @IsNotEmpty()
    number: number; // 질문 번호

    @Field()
    @IsString()
    @IsNotEmpty()
    title: string; //질문 내용

}
