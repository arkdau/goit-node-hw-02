const express = require("express");
const router = express.Router();
const ctrlContacts = require("../../controllers");

router.post("/", ctrlContacts.create);

router.put("/:id", ctrlContacts.update);

router.patch("/:id", ctrlContacts.patchData);

router.delete("/:id", ctrlContacts.remove);

router.post("/signup", ctrlContacts.create);
router.post("/login", ctrlContacts.login);
router.get("/logout", ctrlContacts.jwtAuth, ctrlContacts.logout);
router.get("/current", ctrlContacts.jwtAuth, ctrlContacts.current);

module.exports = router;
