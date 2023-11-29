import { Injectable } from '@nestjs/common';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { Answer } from './entities/answer.entity';
import { QuestionsService } from 'src/questions/questions.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/questions/entities/question.entity';

@Injectable()
export class AnswerService {
  constructor(@InjectRepository(Answer) private answerReposiory: Repository<Answer>,
    private questionsService: QuestionsService) { }

    async createAnswer(createAnswerInput: CreateAnswerInput): Promise<Answer> {
      const question = await this.getQuestion(createAnswerInput.questionIdFk);
      if (!question) {
        throw new Error('Survey not found');
      }
    
      const newAnswer = this.answerReposiory.create({
        ...createAnswerInput,
        question: question
      });
    
      return this.answerReposiory.save(newAnswer);
    }

    async findone(answerIdPk: string, questionIdFk?: string): Promise<Answer> {
      const whereCondition = questionIdFk ? 
        {
          answerIdPk: answerIdPk,
          question: { questionIdPk: questionIdFk }
        } : 
        {
          answerIdPk: answerIdPk
        };
  
      return this.answerReposiory.findOneOrFail({
        where: whereCondition,
        relations: ['question'],
      });
    }

    async findAll(): Promise<Answer[]> {
      return this.answerReposiory.find({
        relations: ['question'], 
      });
    }

    getQuestion(questionId: string): Promise<Question> {
      return this.questionsService.findone(questionId);
    }

}
