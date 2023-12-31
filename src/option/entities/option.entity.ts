import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { Question } from 'src/questions/entities/question.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity('OPTION_TB')
@ObjectType()
export class Option {
  @PrimaryGeneratedColumn('uuid', { name: 'SURVEY_ID_PK' }) //선택지 아이디
  @Field(() => ID)
  optionIdPk: string; 

  @ManyToOne(() => Question, question => question.options) //문항 아이디
  @JoinColumn({ name: 'QUESTION_ID_FK' })
  @Field(() => Question)
  question: Question;

  @Column('int', { name: 'OPTION_NUMBER'}) //선택지 번호
  @Field(type => Int)
  number: number;

  @Column({ name: 'CONTENT'}) //선택지 내용
  @Field()
  content: string;

  @Column('int', { name: 'SCORE' }) //선택지에 대한 점수
  @Field(type => Int)
  score: number;
}
