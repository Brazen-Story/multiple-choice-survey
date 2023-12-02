import { Injectable } from '@nestjs/common';
import { CreateOptionInput } from './dto/create-option.input';
import { Option } from './entities/option.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionsService } from 'src/questions/questions.service';
import { Question } from 'src/questions/entities/question.entity';
import { ERROR_CODES, ERROR_MESSAGES } from 'src/errors/errors.constants';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class OptionService {
  constructor(@InjectRepository(Option) private optionRepository: Repository<Option>,
    private questionsService: QuestionsService,
    private logger: LoggerService) { }

  //선택지 만들기
  async createOption(createOptionInput: CreateOptionInput): Promise<Option> {
    try {
      const question = await this.getQuestion(createOptionInput.questionIdFk);
      if (!question) {
        throw new NotFoundException({
          error: ERROR_CODES.QUESTION_NOT_FOUND,
          message: ERROR_MESSAGES.QUESTION_NOT_FOUND
        });
      }

      const newOption = this.optionRepository.create({
        ...createOptionInput,
        question: question
      });

      this.logger.logVerbose('Create', `${createOptionInput.questionIdFk}에 대한 선택지가 생성되었습니다.`, Option.name);
      return await this.optionRepository.save(newOption);
    } catch (error) {
      this.logger.logError(LoggerService.name, ERROR_CODES.GENERAL_ERROR, error.stack);

      throw new InternalServerErrorException({
        error: ERROR_CODES.GENERAL_ERROR,
        message: ERROR_MESSAGES.GENERAL_ERROR
      });
    }
  }

  //옵션 엔티티 찾기
  async findAll(): Promise<Option[]> {
    try {
      this.logger.logVerbose('Read', `모든 옵션 목록을 찾았습니다.`, Option.name);

      return await this.optionRepository.find({ relations: ['question'] });
    } catch (error) {
      this.logger.logError(LoggerService.name, ERROR_CODES.OPTION_NOT_FOUND, error.stack);

      throw new NotFoundException({
        error: ERROR_CODES.OPTION_NOT_FOUND,
        message: ERROR_MESSAGES.OPTION_NOT_FOUND
      });
    }
  }

  //id와 일치하는 옵션 엔티티 찾기
  async findone(optionIdPk: string, questionIdFk?: string): Promise<Option> {
    try {
      const whereCondition = questionIdFk ?
        { optionIdPk, question: { questionIdPk: questionIdFk } } :
        { optionIdPk };

      this.logger.logVerbose('Read', `${optionIdPk} 옵션을 찾았습니다.`, Option.name);

      return await this.optionRepository.findOneOrFail({
        where: whereCondition,
        relations: ['question'],
      });
    } catch (error) {
      this.logger.logError(LoggerService.name, ERROR_CODES.OPTION_NOT_FOUND, error.stack);

      throw new NotFoundException({
        error: ERROR_CODES.OPTION_NOT_FOUND,
        message: ERROR_MESSAGES.OPTION_NOT_FOUND
      });
    }
  }

  //id와 일치하는 옵션 엔티티 업데이트
  async updateOption(optionIdPk: string, UpdateOptionInput: Partial<Option>): Promise<Option> {
    try {
      await this.optionRepository.update(optionIdPk, UpdateOptionInput);
      const updatedOption = await this.optionRepository.findOne({ where: { optionIdPk } });

      this.logger.logVerbose('Update', `${optionIdPk} 옵션을 업데이트 했습니다.`, Option.name);
      return updatedOption;
    } catch (error) {
      this.logger.logError(LoggerService.name, ERROR_CODES.OPTION_NOT_FOUND, error.stack);

      throw new NotFoundException({
        error: ERROR_CODES.OPTION_NOT_FOUND,
        message: ERROR_MESSAGES.OPTION_NOT_FOUND
      });
    }
  }

  //엔티티 제거
  async remove(optionIdPk: string): Promise<void> {
    try {
      const option = await this.optionRepository.findOne({ where: { optionIdPk } });
      await this.optionRepository.remove(option);
      this.logger.logVerbose('Delete', `${optionIdPk} 옵션을 제거 했습니다.`, Option.name);
    } catch (error) {
      this.logger.logError(LoggerService.name, ERROR_CODES.OPTION_NOT_FOUND, error.stack);

      throw new NotFoundException({
        error: ERROR_CODES.OPTION_NOT_FOUND,
        message: ERROR_MESSAGES.OPTION_NOT_FOUND
      });
    }
  }

  getQuestion(questionId: string): Promise<Question> {
    try {
      this.logger.logVerbose('Read', `${questionId} 문항을 찾았습니다.`, Option.name);
      return this.questionsService.findone(questionId);
    } catch (error) {
      this.logger.logError(LoggerService.name, ERROR_CODES.QUESTION_NOT_FOUND, error.stack);

      throw new NotFoundException({
        error: ERROR_CODES.QUESTION_NOT_FOUND,
        message: ERROR_MESSAGES.QUESTION_NOT_FOUND
      })
    }
  }

}
