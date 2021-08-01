const SurveyRW = require("./surveys");
let surveyAdapter = new SurveyRW();

test("read all survey (readAllSurvey)", () => {
  let readAll = surveyAdapter.readAllSurvey();
  expect(readAll.response.status).toBe("success");
  expect(readAll.httpCode).toBe(200);
});

test("create multiple survey", () => {
  let surveyQuestions = ["Are you a Male?", "Are you older than 18?"];
  let index = 0;
  for (let question of surveyQuestions) {
    index++;
    let readOne = surveyAdapter.createSurvey({ survey_question: question });
    expect(readOne.httpCode).toBe(200);
    expect(readOne.response.status).toBe("success");
    expect(readOne.response.data.length).toBe(index);
    expect(readOne.response.data[index - 1]).toEqual({
      id: index,
      question: question,
      response: { yes: 0, no: 0 },
    });
  }
});

test("attemp to create duplicate survey fails", () => {
  let surveyQuestions = ["Are you a Male?"];
  let index = 0;
  for (let question of surveyQuestions) {
    index++;
    let readOne = surveyAdapter.createSurvey({ survey_question: question });
    expect(readOne.httpCode).toBe(400);
    expect(readOne.response.status).toBe("fail");
  }
});

test("attempt to create additional survey", () => {
  let surveyQuestions = ["Do you like rice?"];
  let index = 0;
  for (let question of surveyQuestions) {
    index++;
    let readOne = surveyAdapter.createSurvey({ survey_question: question });
    expect(readOne.httpCode).toBe(200);
    expect(readOne.response.status).toBe("success");
  }
});

test("attempt to create morethan 3 survey fail", () => {
  let surveyQuestions = [
    "Are you a Male?",
    "Are you older than 18?",
    "Do you like rice?",
  ];
  let index = 0;
  for (let question of surveyQuestions) {
    index++;
    let readOne = surveyAdapter.createSurvey({ survey_question: question });
    expect(readOne.httpCode).toBe(400);
    expect(readOne.response.status).toBe("fail");
  }
});

test("attempt to vote for a survey should succeed", () => {
  let surveyIds = [2];
  let index = 0;
  for (let id of surveyIds) {
    index++;
    let readOne = surveyAdapter.takeSurvey(id, { vote: true });
    expect(readOne.httpCode).toBe(200);
    expect(readOne.response.status).toBe("success");
    expect(readOne.response.data[index].response.yes).toBe(index);
  }
});

test("attempt to vote using an unknown id should fail", () => {
  let surveyIds = [2009090];
  let index = 0;
  for (let id of surveyIds) {
    index++;
    let readOne = surveyAdapter.takeSurvey(id, { vote: true });
    expect(readOne.httpCode).toBe(404);
    expect(readOne.response.status).toBe("fail");
  }
});

test("attempt to vote multiple surveys at once should succeed", () => {
  let votes = [
    { id: 1, vote: true },
    { id: 2, vote: false },
    { id: 3, vote: false },
  ];
  let readOne = surveyAdapter.takeSurveys(votes);
  expect(readOne.httpCode).toBe(200);
  expect(readOne.response.status).toBe("success");
});

test("attempt to vote multiple surveys at once should fail if one of the survey has invalid id", () => {
  let votes = [
    { id: 1676767, vote: true },
    { id: 2, vote: false },
    { id: 3, vote: false },
  ];
  let readOne = surveyAdapter.takeSurveys(votes);
  expect(readOne.httpCode).toBe(404);
  expect(readOne.response.status).toBe("fail");
});

test("attempt to delete a survey should succeed", () => {
  let readOne = surveyAdapter.deleteSurvey(1);
  expect(readOne.httpCode).toBe(200);
  expect(readOne.response.status).toBe("success");
});

test("attempt to delete a survey  with invalid id should fail", () => {
  let readOne = surveyAdapter.deleteSurvey(1898989);
  expect(readOne.httpCode).toBe(404);
  expect(readOne.response.status).toBe("fail");
});

//   test('read specific survey (readSurvey)', () => {
//     let readOne=surveyAdapter.readSurvey(40);
//     console.log(readOne)
//     expect(readOne.httpCode).toBe(200);
//     expect(readOne.response.status).toBe('success');
//     expect(readOne.response.data).toBe(200);
//   });

//   test('read specific survey (readSurvey)', () => {
//     let readOne=surveyAdapter.readSurvey(40);
//     console.log(readOne)
//     expect(readOne.httpCode).toBe(200);
//     expect(readOne.response.status).toBe('success');
//     expect(readOne.response.data).toBe(200);
//   });
