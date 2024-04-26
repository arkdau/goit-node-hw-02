const { router } = require("./../index");
const ctrlContacts = require("../../controllers/database/contacts");
const ctrlUser = require("../../controllers/database/users.js");

router.get("/", ctrlUser.jwtAuth, ctrlContacts.get);

router.get("/:id", ctrlContacts.getById);

router.post("/", ctrlContacts.create);

router.put("/:id", ctrlContacts.update);

router.patch("/:id", ctrlContacts.patchData);

router.delete("/:id", ctrlContacts.remove);

module.exports = router;
