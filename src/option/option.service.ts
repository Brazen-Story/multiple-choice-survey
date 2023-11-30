import { Injectable } from '@nestjs/common';
import { CreateOptionInput } from './dto/create-option.input';
import { Option } from './entities/option.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionsService } from 'src/questions/questions.service';
import { Question } from 'src/questions/entities/question.entity';

@Injectable()
export class OptionService {
  constructor(@InjectRepository(Option) private optionRepository: Repository<Option>,
    private questionsService: QuestionsService) { }

    async createOption(createOptionInput: CreateOptionInput): Promise<Option> {
      const question = await this.getQuestion(createOptionInput.questionIdFk);
      if (!question) {
        throw new Error('Survey not found');
      }
    
      const newOption = this.optionRepository.create({
        ...createOptionInput,
        question: question
      });
    
      return this.optionRepository.save(newOption);
    }

    async findAll(): Promise<Option[]> {
      return this.optionRepository.find({
        relations: ['question'], 
      });
    }

    async findone(optionIdPk: string, questionIdFk?: string): Promise<Option> {
      const whereCondition = questionIdFk ? 
        {
          optionIdPk: optionIdPk,
          question: { questionIdPk: questionIdFk }
        } : 
        {
          optionIdPk: optionIdPk
        };
  
      return this.optionRepository.findOneOrFail({
        where: whereCondition,
        relations: ['question'],
      });
    }

    async remove(optionIdPk: string): Promise<void> {
      const option = await this.optionRepository.findOne({ where: { optionIdPk } });
      if (option) {
        await this.optionRepository.remove(option);
      } else {
        throw new Error('선택지를 찾을 수 없습니다 !');
      }
    }

    getQuestion(questionId: string): Promise<Question> {
      return this.questionsService.findone(questionId);
    }
}
