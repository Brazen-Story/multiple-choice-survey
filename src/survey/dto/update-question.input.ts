import { createSurveyInput } from './create-survey.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSurveyInput extends PartialType(createSurveyInput) {
  @Field()
  name: string;

  @Field()
  content: string;

  @Field()
  state: string;
}
