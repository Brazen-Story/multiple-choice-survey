import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Survey } from 'src/survey/entities/survey.entity';
import { Option } from 'src/option/entities/option.entity';
import { Answer } from 'src/answer/entities/answer.entity';

@Entity('QUESTION_TB')
@ObjectType()
export class Question {
  @PrimaryGeneratedColumn('uuid', {name: 'QUESTION_ID_PK'}) //문항 아이디
  @Field(() => ID)
  questionIdPk: string;

  @ManyToOne(() => Survey, survey => survey.questions) // 설문지 아이디
  @Field(() => Survey)
  @JoinColumn({ name: 'SURVEY_ID_FK' })
  survey: Survey;

  @Column('int', { name: 'NUMBER'}) //문항 번호
  @Field(type => Int)
  number: number;

  @Column({ name: 'TITLE'}) //문항 제목
  @Field()
  title: string;

  //option테이블과 1:N 
  @OneToMany(() => Option, option => option.question)
  @Field(() => [Option])
  options: Option[];

  //answer테이블과 1:N
  @OneToMany(() => Answer, answer => answer.question)
  @Field(() => [Answer])
  answers: Answer[];
}
