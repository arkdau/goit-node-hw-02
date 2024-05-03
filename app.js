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





///////////////////////////////////////////////////////////////////////////////
// const UPLOAD_DIR = path.join(__dirname, "public", "avatars");
// const UPLOAD_DIR = path.join(__dirname, "tmp");
//
// // double check that  the dir exists
// stat(UPLOAD_DIR).catch(() => mkdir(UPLOAD_DIR, { recursive: true }));
//
// const storage = multer.diskStorage({
//   destination: function (_, __, cb) {
//     // check ext and decide where the fils should go
//     cb(null, UPLOAD_DIR);
//   },
//   filename: function (_, file, cb) {
//     const fileExt = path.extname(file.originalname);
//     const fileNameWithoutExt = path.basename(file.originalname, fileExt);
//     const finalFileName = `${fileNameWithoutExt}-${Date.now()}${fileExt}`;
//     // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//     // cb(null, file.fieldname + "-" + uniqueSuffix);
//     cb(null, finalFileName);
//   },
// });
//
// const upload = multer({
//   // dest: UPLOAD_DIR,
//   storage,
//   limits: {
//     fileSize: 1024 * 1024, // 1MB
//   },
// });
//
// // http://localhost:<port>/avatars/<nazwa pliku z rozszerzeniem>
//
// app.patch("/users/avatars", upload.single("picture"), (req, res) => {
//   if (req.file) {
//     res.send({
//       code: 201,
//       status: "SUCCES",
//       message: "The file has been created",
//     });
//   } else {
//     res.send({
//       code: 400,
//       status: "FAILURE",
//       message: "The file cannot be stored",
//     });
//   }
// });
///////////////////////////////////////////////////////////////////////////////////////








// const fs = require("node:fs/promises");
//
// const baseDir = path.dirname(__dirname);
// const avatarPath = path.join(
//   baseDir,
//   "/public/avatars/raptor-f35-1714168812487.png",
// );
//
// app.get("/avatars", async (req, res) => {
//   try {
//     const data = await fs.readFile(avatarPath, "utf8");
//
//     // const results = await service.getAllcontacts();
//
//     res.setHeader("Connection", "close");
//     res.json({
//       status: "success",
//       code: 200,
//       // data: {
//       file: data,
//       // },
//     });
//     res.end();
//   } catch (e) {
//     console.error(e);
//     // next(e);
//   }
//
//   req.end();
// });

// app.get =  (req, res) => {
//
//   try {
//
//
//     const data = await fs.readFile(contactsPath, "utf8");
//
//     // const results = await service.getAllcontacts();
//     res.json({
//       status: "success",
//       code: 200,
//       // data: {
//         file: data,
//       // },
//     });
//   } catch (e) {
//     console.error(e);
//     next(e);
//   }
// };



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
