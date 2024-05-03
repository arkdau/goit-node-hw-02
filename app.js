const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("morgan");

// const { stat, mkdir } = require("fs/promises");
// const multer = require("multer");
// const path = require("path");

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

const userRouter = require("./routes/api/users"); // userRoutes
const contactsRouter = require("./routes/api/contacts"); // userRoutes

// const publicRouter = require("./routes/api/public"); // publicRoutes

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// load app middlewares
app.use(logger(formatsLogger));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cors
app.use(cors());
// parse application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

















app.use("/users/", userRouter);
app.use("/api/contacts", contactsRouter);
 // app.use("/users/avatars", publicRouter);

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api/contacts",
    data: "Not found",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});

module.exports = app;
