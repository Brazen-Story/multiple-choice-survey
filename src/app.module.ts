import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SurveyModule } from './survey/survey.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsModule } from './questions/questions.module';
import { AnswerModule } from './answer/answer.module';
import { OptionModule } from './option/option.module';

@Module({
  imports: [GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'svc.sel5.cloudtype.app',
    port: 32686,
    username: 'root',
    password: 'akdmadusrnth1004',
    database: 'survey',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
  SurveyModule,
  QuestionsModule,
  AnswerModule,
  OptionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
