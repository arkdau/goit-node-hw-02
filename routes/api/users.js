const { router } = require("./../index");
const ctrlUser = require("../../controllers/database/users.js");

router.post("/signup", ctrlUser.create);
router.post("/login", ctrlUser.login);
router.get("/logout", ctrlUser.jwtAuth, ctrlUser.logout);

const { stat, mkdir } = require("fs/promises");
const multer = require("multer");
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "./../../tmp");

// double check that  the dir exists
stat(UPLOAD_DIR).catch(() => mkdir(UPLOAD_DIR, { recursive: true }));

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    // check ext and decide where the fils should go
    cb(null, UPLOAD_DIR);
  },
  filename: function (_, file, cb) {
    cb(null, file.originalname);
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
  upload.single("avatar"), // lepiej to brzmi
  ctrlUser.avatars,
);

router.get(
  "/verify/:verificationToken",
  ctrlUser.verify,
);


router.post(
  "/verify/",
  ctrlUser.reSendVerifyEmail,
);





module.exports = router;
