
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("morgan");

require("dotenv").config();

const app = express();

// connect to mongoose db
const DB_URL = process.env.DB_HOST;
const db = mongoose.connect(DB_URL);

db.then(() => {
  console.log("Database connection successful");
}).catch((err) => {
  console.log(err);
  process.exit(1);
});

const bodyParser = require("body-parser");

const contactsRouter = require("./routes/api"); // userRoutes

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// load app middlewares
app.use(logger(formatsLogger));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cors
app.use(cors());
// parse application/json
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/contacts", contactsRouter);

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api/contacts",
    data: "Not found",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack)
  res.status(500).json({
    status: 'fail',
    code: 500,
    message: err.message,
    data: 'Internal Server Error',
  });
});

module.exports = app;
