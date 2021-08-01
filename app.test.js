const request = require("supertest");
const app = require("./app");

describe("TEST /surveys", () => {
  describe("GET /surveys", () => {
    test("should  be able to retrieve empty dataset when no survey in datastore", async () => {
      const response = await request(app)
        .get("/api/v1/surveys")
        .send()
        .expect(200);
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.text)).toEqual({
        status: "success",
        message: "success",
        data: [],
      });
    });
  });

  describe("POST /surveys", () => {
    test("should be able to create one or more survey", async () => {
      let surveyQuestions = [
        "Are you a Male?",
        "Are you older than 18?",
        "Do you like rice?",
      ];
      let index = 0;
      for (let question of surveyQuestions) {
        index++;
        const response = await request(app)
          .post("/api/v1/surveys")
          .send({ survey_question: question })
          .expect(200);
        expect(response.statusCode).toBe(200);
        let responseObj = JSON.parse(response.text);
        expect(responseObj.data.length).toBeGreaterThan(index - 1);
        expect(responseObj.data[index - 1]).toEqual({
          id: index,
          question: question,
          response: {
            yes: 0,
            no: 0,
          },
        });
      }
    });

    test("should fail if you attempty to create a 4th survey", async () => {
      let surveyQuestions = ["Should i create morethan 3 survey?"];
      let index = 0;
      for (let question of surveyQuestions) {
        index++;
        const response = await request(app)
          .post("/api/v1/surveys")
          .send({ survey_question: question })
          .expect(400);
        expect(response.statusCode).toBe(400);
      }
    });
  });

  describe("GET /survey end point", () => {
    test("should be able to  retrieve specific survey", async () => {
      const response = await request(app)
        .get("/api/v1/surveys/1")
        .send()
        .expect(200);
      expect(response.statusCode).toBe(200);
      let responseObj = JSON.parse(response.text);
      expect(responseObj.data).toEqual({
        id: 1,
        question: "Are you a Male?",
        response: {
          yes: 0,
          no: 0,
        },
      });
    });

    test("should fail if invalid survey id is provided", async () => {
      const response = await request(app)
        .get("/api/v1/surveys/10000888787")
        .send()
        .expect(404);
      expect(response.statusCode).toBe(404);
      let responseObj = JSON.parse(response.text);
      expect(responseObj.message).toContain("unknown");
    });
  });

  describe("PUT /surveys", () => {
    test("should be able to vote for single surver", async () => {
      const response = await request(app)
        .put("/api/v1/surveys/1")
        .send({ vote: "true" })
        .expect(200);
      expect(response.statusCode).toBe(200);
      let responseObj = JSON.parse(response.text);
      expect(responseObj.data[0].response.yes).toBeGreaterThan(0);
    });

    test("should be able to vote for one or multiple survey", async () => {
      const response = await request(app)
        .put("/api/v1/surveys")
        .send([
          { vote: true, id: 1 },
          { vote: false, id: 2 },
          { vote: true, id: 3 },
        ])
        .expect(200);
      expect(response.statusCode).toBe(200);
      let responseObj = JSON.parse(response.text);
      expect(responseObj.data[0].response.yes).toEqual(2);
      expect(responseObj.data[1].response.no).toEqual(1);
      expect(responseObj.data[2].response.yes).toEqual(1);
    });

    test("should be able to vote for one or multiple survey even if boolean value is  passed as string", async () => {
      const response = await request(app)
        .put("/api/v1/surveys")
        .send([{ vote: "true", id: 1 }])
        .expect(200);
      expect(response.statusCode).toBe(200);
      let responseObj = JSON.parse(response.text);
      expect(responseObj.data[0].response.yes).toBeGreaterThan(0);
    });
  });

  describe("DELETE /surveys", () => {
    test("should be able to  delete a survey", async () => {
      const response = await request(app)
        .delete("/api/v1/surveys/1")
        .send()
        .expect(200);
      expect(response.statusCode).toBe(200);
      let responseObj = JSON.parse(response.text);
      expect(responseObj.message).toContain("deleted");
    });

    test("should display appropriate message on attempt to delete non existent id", async () => {
      const response = await request(app)
        .delete("/api/v1/surveys/1009878787")
        .send()
        .expect(404);
      expect(response.statusCode).toBe(404);
      let responseObj = JSON.parse(response.text);
      expect(responseObj.message).toContain("doesnt exist");
    });
  });
});
