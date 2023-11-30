import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany } from "typeorm";
import { Question } from 'src/questions/entities/question.entity';

@Entity('SURVEY_TB')
@ObjectType()
export class Survey {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  surveyIdPk: string;

  @Column({ type: 'text' })
  @Field()
  name: string;

  @Column({ type: 'text' })
  @Field()
  content: string;

  @Column({ type: 'varchar', length: 9 }) //완성 또는 미완성
  @Field()
  state: string;

  @OneToMany(() => Question, question => question.survey, { onDelete: 'CASCADE' })
  @Field(() => [Question])
  questions: Question[];
}
