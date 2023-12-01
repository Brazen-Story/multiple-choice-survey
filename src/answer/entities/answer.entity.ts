import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Question } from 'src/questions/entities/question.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity('ANSWER_TB')
@ObjectType()
export class Answer {
  @PrimaryGeneratedColumn('uuid', { name: 'ANSWER_ID_PK' }) //응답 아이디
  @Field(() => ID)
  answerIdPk: string; 

  @ManyToOne(() => Question, question => question.answers) //문항 아이디
  @JoinColumn({ name: 'QUESTION_ID_FK' })
  @Field(() => Question)
  question: Question;

  @Column({ name: 'ANSWER_NUMBER' }) //사용자 응답 번호
  @Field()
  number: number;

}
