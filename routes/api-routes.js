const express = require("express");
const router = express.Router();
const SurveyAdapter = require("../controller/surveys");

/**
 * @swagger
 * components:
 *   schemas:
 *     surveys:
 *       type: object
 *       required:
 *         - status
 *         - message
 *         - data
 *       properties:
 *         status:
 *           type: string
 *           description: Response Message. Can be success,fail,error
 *         message:
 *           type: string
 *           description: Detailed Response Message
 *         data:
 *           type: array
 *           items:
 *              $ref: '#/definitions/survey'
 *              description: The Survey
 *
 *       survey:
 *          type : object
 *          properties :
 *              id:
 *                 type : string
 *              question:
 *                 type:string
 *              response:
 *                 type: object
 *                 properties:
 *                      yes:
 *                          type:integer
 *                      no:
 *                          type:integer
 *
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - survey_question
 *       properties:
 *         survey_question:
 *           type: string
 *           description: Response Message. Can be success,fail,error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Vote:
 *       type: object
 *       required:
 *         - vote
 *       properties:
 *         vote:
 *           type: boolean
 *           description: Response Message. Can be success,fail,error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Votes:
 *       type: array
 *       items:
 *           type: object
 *           properties:
 *              vote:
 *                  type: boolean
 *              id:
 *                  type: integer
 *           description: Response Message. Can be success,fail,error
 */

/**
 * @swagger
 * /api/v1/surveys:
 *   get:
 *     summary: Displays all surveys in the repository. Maximun = 3
 *     responses:
 *       200:
 *         description: The list of  surveys
 *       500:
 *          description: Some server error
 */
router.get("/surveys", (req, res) => {
  (async () => {
    let result = await new SurveyAdapter().readAllSurvey();
    res.status(result.httpCode).json(result.response);
  })();
});

/**
 * @swagger
 * /api/v1/surveys/{id}:
 *   get:
 *     summary: Retrieve specific survey by providing the survey id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The survey id
 *     responses:
 *       200:
 *         description: Successful retrieval
 *         contens:
 *           application/json:
 *       404:
 *         description: The survey was not found
 *
 */
router.get("/surveys/:id", (req, res) => {
  (async () => {
    let result = await new SurveyAdapter().readSurvey(req.params.id);
    res.status(result.httpCode).json(result.response);
  })();
});

/**
 * @swagger
 * /api/v1/surveys/:
 *   post:
 *     summary: Create a new survey
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: The survey was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       500:
 *         description: Some server error
 */
router.post("/surveys", (req, res) => {
  (async () => {
    let result = await new SurveyAdapter().createSurvey(req.body);
    res.status(result.httpCode).json(result.response);
  })();
});

/**
 * @swagger
 * /api/v1/surveys/{id}:
 *   delete:
 *     summary: Delete a survey by providing the ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Survey id
 *     responses:
 *       200:
 *         description: The survey was deleted
 *       404:
 *         description: The survey was not found
 *       500:
 *         description: Some server error
 */
router.delete("/surveys/:id", (req, res) => {
  (async () => {
    let result = await new SurveyAdapter().deleteSurvey(req.params.id);
    res.status(result.httpCode).json(result.response);
  })();
});

/**
 * @swagger
 /api/v1/surveys/{id}:
 *  put:
 *    summary: Cast a vote on  a particular survey. Vote options are true and false
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The survey id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Vote'
 *    responses:
 *      200:
 *        description: You successfully voted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Vote'
 *      404:
 *        description: The survey was not found
 *      500:
 *        description: Some error happened
 */
router.put("/surveys/:id", (req, res) => {
  (async () => {
    let result = await new SurveyAdapter().takeSurvey(req.params.id, req.body);
    res.status(result.httpCode).json(result.response);
  })();
});

/**
 * @swagger
 /api/v1/surveys/:
 *  put:
 *    summary: Cast a vote on multiple surveys at a time. 
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Votes'
 *    responses:
 *      200:
 *        description: You successfully voted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Votes'
 *      404:
 *        description: The survey was not found
 *      500:
 *        description: Some error happened
 */

router.put("/surveys", (req, res) => {
  (async () => {
    let result = await new SurveyAdapter().takeSurveys(req.body);
    // res.status(result.httpCode).send(JSON.stringify(result.response, null, 3));
    res.status(result.httpCode).json(result.response);
  })();
});

module.exports = router;
