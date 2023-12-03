## 💁‍♂️ 소개
- 이 프로젝트는 __설문지 백엔드 미션__ 입니다. <br>
- Nest.js에서 GraphQL 애플리케이션을 구축하는 방법으로 __code-first__ 방법을 선택했습니다.
- 데이터베이스는 CloudType으로 배포되어 있으며 host, port, username, password, database 정보가 __의도적으로 오픈__ 되어 있습니다.<br>

## 🔧 설치
```bash
$ git clone https://github.com/Brazen-Story/multiple-choice-survey.git
$ npm install
```

## 🔥 실행

```bash
$ npm run start:dev
```

## 🛠️ 기술 스택
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white"> <img src="https://img.shields.io/badge/Nest.Js-E0234E?style=for-the-badge&logo=NestJs&logoColor=white"> <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgreSQL&logoColor=white"> <img src="https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=Graphql&logoColor=white"> <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">

## 📊 ERD
- 테이블 간의 관계는 __식별 관계__ 에 있습니다.<br>
- SURVEY_TB 테이블의 STATE 컬럼은 DEFAULT로 '미완료'으로 지정되어 있습니다.<br><br>
![image](https://github.com/Brazen-Story/multiple-choice-survey/assets/88796297/c3a3494f-0fb9-419a-a769-fb41086f51c9)

## 📝 API 기능
 - [설문지 CRUD](https://github.com/Brazen-Story/multiple-choice-survey/tree/master/src/survey)
 - [문항 CRUD](https://github.com/Brazen-Story/multiple-choice-survey/tree/master/src/questions)
 - [선택지 CURD](https://github.com/Brazen-Story/multiple-choice-survey/tree/master/src/option)
 - [답변 CRUD](https://github.com/Brazen-Story/multiple-choice-survey/tree/master/src/answer)
 - 설문지 완료 
 - 완료된 설문지 확인
   - 완료된 설문지로 __총점__ 을 확인할 수 있습니다.
     
- __설문지 완료__ 와 __완료된 설문지 확인__ 은 [여기](https://github.com/Brazen-Story/multiple-choice-survey/tree/master/src/survey)서 만나보실 수 있습니다.

## 🐛 에러 처리
 - 요청 실패에 대한 에러 리턴을 합니다.
 - 에러 응답에 대해 일관되게 작성했습니다.
 - [여기](https://github.com/Brazen-Story/multiple-choice-survey/tree/master/src/errors) 를 클릭하시면 바로 만나보실 수 있습니다.

# 📜 로그
- 에러 및 요청 성공시 로그를 확인할 수 있게 작성했습니다.
- [여기](https://github.com/Brazen-Story/multiple-choice-survey/tree/master/src/logger) 를 클릭하시면 바로 만나보실 수 있습니다.

## 📐 스키마
이 스키마는 __필수 엔티티__ 와 관계하는 스키마입니다. 자세한 내용은 실제 __[스키마 파일](https://github.com/Brazen-Story/multiple-choice-survey/blob/master/src/schema.gql)__ 을 참조해주세요.
```graphql
type Survey {
  content: String!
  name: String!
  questions: [Question!]!
  state: String!
  surveyIdPk: ID!
  totalScore: Int
}

type Question {
  answers: [Answer!]!
  number: Int!
  options: [Option!]!
  questionIdPk: ID!
  survey: Survey!
  title: String!
}

type Option {
  content: String!
  number: Int!
  optionIdPk: ID!
  question: Question!
  score: Int!

type Answer {
  answerIdPk: ID!
  number: Int!
  question: Question!
}
```
## 🔗 Connect

- __Email : kimbong523@gmail.com__
  

