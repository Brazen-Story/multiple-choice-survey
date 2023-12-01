import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateSurveyInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string; //설문지 이름

    @Field()
    @IsString()
    @IsNotEmpty()
    content: string; //설문 내용

}