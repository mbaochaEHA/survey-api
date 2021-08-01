const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const responseObject = require("./data-response");
const Joi = require("joi");
let adapter = null;

//Seperate datastore for testing from that for coreDB
//the JEST_WORKER_ID are always available on env when run with jest
if (process.env["JEST_WORKER_ID"]) {
  adapter = lowDb(new FileSync("surveys.test.json"));
  adapter.get("surveys").remove().write();
} else {
  adapter = lowDb(new FileSync("surveys.json"));
}

adapter.defaults({ surveys: [] }).write();

class SurveyRW {
  constructor() {}

  surveySchema = (id, question) => {
    return {
      id: id,
      question: question,
      response: {
        yes: 0,
        no: 0,
      },
    };
  };
  readAllSurvey = () => {
    try {
      return responseObject(
        200,
        "success",
        "success",
        adapter.get("surveys").value()
      );
    } catch (err) {
      console.log(err);
      return responseObject(500, "err", "server error", null);
    }
  };
  readSurvey = (id) => {
    try {
      let schema = Joi.number().required();
      let validationResponse = schema.validate(id);
      if (validationResponse.error) {
        return responseObject(400, "fail", validationResponse.error, null);
      }
      id = parseInt(id);
      let surveyRecord = adapter.get("surveys").find({ id: id });
      if (!surveyRecord.value())
        return responseObject(
          404,
          "fail",
          `attempt to vote using an unknown id. id = ${id}`,
          null
        );
      let result = adapter.get("surveys").find({ id: id }).value();
      return responseObject(200, "success", "success", result);
    } catch (err) {
      console.log(err);
      return responseObject(500, "err", "server error", null);
    }
  };
  createSurvey = (question) => {
    try {
      let schema = Joi.object({
        survey_question: Joi.string().min(3).required(),
      });
      let validationResponse = schema.validate(question);
      if (validationResponse.error) {
        return responseObject(400, "fail", validationResponse.error, null);
      }
      let surveys = adapter.get("surveys");
      let id =
        surveys.value().length > 0
          ? surveys.value()[surveys.value().length - 1].id + 1
          : 1;
      if (surveys.value().length >= 3)
        return responseObject(
          400,
          "fail",
          "you cant create morethan 3 surveys",
          null
        );

      //this should have been case insensitive. possible future enhancement
      if (
        adapter
          .get("surveys")
          .find({ question: question.survey_question })
          .value()
      )
        return responseObject(
          400,
          "fail",
          "Attempt to create duplicate survey",
          null
        );
      adapter
        .get("surveys")
        .push(this.surveySchema(id, question.survey_question))
        .write();
      return responseObject(
        200,
        "success",
        "success",
        adapter.get("surveys").value()
      );
    } catch (err) {
      console.log(err);
      return responseObject(500, "error", "server error", null);
    }
  };

  takeSurvey = (id, vote) => {
    try {
      let schema = Joi.object({
        id: Joi.number(),
        vote: { vote: Joi.boolean() },
      });
      let validationResponse = schema.validate({ id, vote });
      if (validationResponse.error) {
        return responseObject(400, "fail", validationResponse.error, null);
      }
      id = parseInt(id); //cast to int
      let surveyRecord = adapter.get("surveys").find({ id: id });
      if (!surveyRecord.value())
        return responseObject(
          404,
          "fail",
          `attempt to vote using an unknown id. id = ${id}`,
          null
        );
      let { yes, no } = adapter
        .get("surveys")
        .find({ id: id })
        .value().response;
      String(vote.vote) == "true" ? yes++ : no++;
      adapter
        .get("surveys")
        .find({ id: id })
        .assign({ response: { yes, no } })
        .write();
      return responseObject(
        200,
        "success",
        "success",
        adapter.get("surveys").value()
      );
    } catch (err) {
      console.log(err);
      return responseObject(500, "error", "server error", null);
    }
  };

  takeSurveys = (votes) => {
    try {
      let schema = Joi.array().items(
        Joi.object({
          id: Joi.number().required(),
          vote: Joi.boolean().required(),
        })
      );
      let validationResponse = schema.validate(votes);
      if (validationResponse.error) {
        return responseObject(400, "fail", validationResponse.error, null);
      }
      let surveyAdapter = adapter.get("surveys");
      for (let vote of votes) {
        let adapterResponse = surveyAdapter.find({ id: vote.id }).value();
        if (!adapterResponse)
          return responseObject(
            404,
            "fail",
            `attempt to vote using an unknown id. id = ${vote.id}`,
            null
          );
      }
      for (let vote of votes) {
        let { yes, no } = adapter
          .get("surveys")
          .find({ id: vote.id })
          .value().response;
        String(vote.vote) === "true" ? yes++ : no++;
        adapter
          .get("surveys")
          .find({ id: vote.id })
          .assign({ response: { yes, no } })
          .write();
      }
      return responseObject(
        200,
        "success",
        "success",
        adapter.get("surveys").value()
      );
    } catch (err) {
      console.log(err);
      return responseObject(500, "error", "server error", null);
    }
  };
  deleteSurvey = (id) => {
    try {
      let schema = Joi.number().required();
      let validationResponse = schema.validate(id);
      if (validationResponse.error) {
        return responseObject(400, "fail", validationResponse.error, null);
      }
      id = parseInt(id);
      let surveyRecord = adapter.get("surveys").find({ id: id });
      if (!surveyRecord.value())
        return responseObject(
          404,
          "fail",
          `this survey with id =${id} doesnt exist or is already deleted`,
          null
        );
      adapter.get("surveys").remove({ id }).write();
      return responseObject(
        200,
        "success",
        `survey ${id} successfully deleted`,
        null
      );
    } catch (err) {
      console.log(err);
      return responseObject(500, "error", "server error", null);
    }
  };
}

module.exports = SurveyRW;
