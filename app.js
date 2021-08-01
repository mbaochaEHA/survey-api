const express = require("express");
const cors = require("cors");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const apiRouter = require("./routes/api-routes");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();

const logStream = fs.createWriteStream(path.join(__dirname, "log.log"), {
  flags: "a",
});
const PORT = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Survey API",
      version: "1.0.0",
      description: "Simple Survey API",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(cors());
app.use(express.json());
app.use(morgan("combined", { stream: logStream }));

//app.db = adapter;

app.PORT = PORT;

app.use("/api/v1/", apiRouter);

module.exports = app;
