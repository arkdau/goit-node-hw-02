const { router } = require("./../index");
const ctrlUser = require("../../controllers/database/users.js");

router.post("/signup", ctrlUser.create);
router.post("/login", ctrlUser.login);
router.get("/logout", ctrlUser.jwtAuth, ctrlUser.logout);

const { stat, mkdir } = require("fs/promises");
const multer = require("multer");
const path = require("path");

// const UPLOAD_DIR = path.join(__dirname, "public", "avatars");
const UPLOAD_DIR = path.join(__dirname, "./../../tmp");
// const DEST_DIR = path.join(__dirname, "./../../public/avatars/");

// double check that  the dir exists
stat(UPLOAD_DIR).catch(() => mkdir(UPLOAD_DIR, { recursive: true }));

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    // check ext and decide where the fils should go
    cb(null, UPLOAD_DIR);
  },
  filename: function (_, file, cb) {
    cb(null, file.originalname);
    // const fileExt = path.extname(file.originalname);
    // const fileNameWithoutExt = path.basename(file.originalname, fileExt);
    // const finalFileName = `${fileNameWithoutExt}-${Date.now()}${fileExt}`;
    // // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    // // cb(null, file.fieldname + "-" + uniqueSuffix);
    // cb(null, finalFileName);
  },
});

const upload = multer({
  // dest: UPLOAD_DIR,
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024, // 1MB
  },
});

router.patch(
  "/avatars",
  ctrlUser.jwtAuth,
  upload.single("RequestBody"),
  ctrlUser.avatars,
);

module.exports = router;
