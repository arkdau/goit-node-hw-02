const { router } = require("./../index");
const ctrlUser = require("../../controllers/database/users.js");

router.post("/signup", ctrlUser.create);
router.post("/login", ctrlUser.login);
router.get("/logout", ctrlUser.jwtAuth, ctrlUser.logout);
router.get("/current", ctrlUser.jwtAuth, ctrlUser.current);

module.exports = router;
