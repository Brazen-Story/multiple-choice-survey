import { Injectable } from '@nestjs/common';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { Answer } from './entities/answer.entity';
import { QuestionsService } from 'src/questions/questions.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/questions/entities/question.entity';
import { ERROR_CODES, ERROR_MESSAGES } from 'src/errors/errors.constants';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AnswerService {
  constructor(@InjectRepository(Answer) private answerRepository: Repository<Answer>,
    private questionsService: QuestionsService) { }

  //응답 만들기
  async createAnswer(createAnswerInput: CreateAnswerInput): Promise<Answer> {
    try {
      const question = await this.getQuestion(createAnswerInput.questionIdFk);
      if (!question) {
        throw new NotFoundException({
          error: ERROR_CODES.QUESTION_NOT_FOUND,
          message: ERROR_MESSAGES.QUESTION_NOT_FOUND
        });
      }

      const newAnswer = this.answerRepository.create({
        ...createAnswerInput,
        question: question
      });

      return this.answerRepository.save(newAnswer);
    } catch (error) {
      throw new InternalServerErrorException({
        error: ERROR_CODES.GENERAL_ERROR,
        message: ERROR_MESSAGES.GENERAL_ERROR
      });
    }
  }

  //모든 응답 엔티티 찾기
  async findAll(): Promise<Answer[]> {
    try {
      return await this.answerRepository.find({ relations: ['question'] });
    } catch (error) {
      throw new InternalServerErrorException({
        error: ERROR_CODES.GENERAL_ERROR,
        message: ERROR_MESSAGES.GENERAL_ERROR
      });
    }
  }

  //id 일치하는 응답 엔티티 찾기
  async findone(answerIdPk: string, questionIdFk?: string): Promise<Answer> {
    try {
      const whereCondition = questionIdFk ?
        { answerIdPk, question: { questionIdPk: questionIdFk } } :
        { answerIdPk };

      return await this.answerRepository.findOneOrFail({
        where: whereCondition,
        relations: ['question'],
      });
    } catch (error) {
      throw new NotFoundException({
        error: ERROR_CODES.ANSWER_NOT_FOUND,
        message: ERROR_MESSAGES.ANSWER_NOT_FOUND
      });
    }
  }

  //id 일치하는 응답 업데이트
  async updateAnswer(answerIdPk: string, UpdateAnswerInput: Partial<Answer>): Promise<Answer> {
    try {
      await this.answerRepository.update(answerIdPk, UpdateAnswerInput);
      const updatedAnswer = await this.answerRepository.findOne({ where: { answerIdPk } });

      return updatedAnswer;
    } catch (error) {
      throw new NotFoundException({
        error: ERROR_CODES.ANSWER_NOT_FOUND,
        message: ERROR_MESSAGES.ANSWER_NOT_FOUND
      });
    }
  }

  //id 일치하는 응답 삭제
  async remove(answerIdPk: string): Promise<void> {
    try {
      const answer = await this.answerRepository.findOne({ where: { answerIdPk } });
      await this.answerRepository.remove(answer);
    } catch (error) {
      throw new NotFoundException({
        error: ERROR_CODES.ANSWER_NOT_FOUND,
        message: ERROR_MESSAGES.ANSWER_NOT_FOUND
      });
    }
  }

  getQuestion(questionId: string): Promise<Question> {
    try {
      return this.questionsService.findone(questionId);
    } catch (error) {
      throw new NotFoundException({
        error: ERROR_CODES.QUESTION_NOT_FOUND,
        message: ERROR_MESSAGES.QUESTION_NOT_FOUND
      })
    }
  }
}
