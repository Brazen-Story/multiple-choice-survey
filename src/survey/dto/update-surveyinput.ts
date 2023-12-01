import { CreateSurveyInput } from './create-survey.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSurveyInput extends PartialType(CreateSurveyInput) {
  @Field({ nullable: true }) //이름
  name?: string;

  @Field({ nullable: true }) //본문
  content?: string;

  @Field({ nullable: true }) //상태
  state?: string;
}
