import { Module } from '@nestjs/common';
import { SurveyModule } from './survey/survey.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsModule } from './questions/questions.module';
import { AnswerModule } from './answer/answer.module';
import { OptionModule } from './option/option.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: +configService.get<number>('DB_PORT'),
      username: configService.get('DB_NAME'),
      password: configService.get('DB_PW'),
      database: configService.get('DB_DATABASE'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    inject: [ConfigService],
  }),
  SurveyModule,
  QuestionsModule,
  AnswerModule,
  OptionModule,],
})
export class AppModule {}
