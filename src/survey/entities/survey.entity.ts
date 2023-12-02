import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Question } from 'src/questions/entities/question.entity';

@Entity('SURVEY_TB')
@ObjectType()
export class Survey {
  @PrimaryGeneratedColumn('uuid', { name: 'SURVEY_ID_PK' }) //설문지 아이디
  @Field(() => ID)
  surveyIdPk: string;

  @Column({ type: 'text', name: 'NAME' }) //설문지 이름
  @Field()
  name: string;

  @Column({ type: 'text', name: 'CONTENT' }) //설문 내용
  @Field()
  content: string;

  @Column({
    type: 'varchar',
    length: 9,
    name: 'STATE',
    default: '미완료'
  }) //설문지 상태
  @Field()
  state: string;

  @OneToMany(() => Question, question => question.survey)
  @Field(() => [Question])
  questions: Question[];

  @Field(type=> Int, { nullable: true })
  totalScore?: number;
}
