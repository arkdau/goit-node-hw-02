const express = require("express");
const router = express.Router();
const ctrlContacts = require("../../controllers");
// const {jwtAuth, current} = require("./controllers/list");

// router.get("/", ctrlContacts.get);

// router.get("/:id", ctrlContacts.getById);

router.post("/", ctrlContacts.create);

router.put("/:id", ctrlContacts.update);

router.patch("/:id", ctrlContacts.patchData);

router.delete("/:id", ctrlContacts.remove);

// router.post("/", ctrlContacts.register);

router.post("/signup", ctrlContacts.create);
router.post("/login", ctrlContacts.login);
router.get("/current", ctrlContacts.jwtAuth, ctrlContacts.current);

module.exports = router;
