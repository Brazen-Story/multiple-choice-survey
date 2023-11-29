import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class createSurveyInput {
    @Field()
    name: string;

    @Field()
    content: string;

    @Field()
    state: string;
}