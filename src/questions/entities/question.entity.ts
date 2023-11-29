import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Survey } from 'src/survey/survey.entity';
import { Option } from 'src/option/entities/option.entity';
import { Answer } from 'src/answer/entities/answer.entity';

@Entity('QUESTION_TB')
@ObjectType()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  questionIdPk: string;

  @Field(() => Survey)
  @ManyToOne(() => Survey, survey => survey.questions)
  @JoinColumn({ name: 'SURVEY_ID_FK' })
  survey: Survey;

  @Column()
  @Field()
  number: number;

  @Column()
  @Field()
  title: string;

  @OneToMany(() => Option, option => option.question)
  @Field(() => [Option])
  options: Option[];

  @OneToMany(() => Answer, anaswer => anaswer.question)
  @Field(() => [Answer])
  answers: Answer[];
}
