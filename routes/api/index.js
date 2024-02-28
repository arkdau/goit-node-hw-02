const express = require("express");
const router = express.Router();
const ctrlContacts = require("../../controller");

router.get("/", ctrlContacts.get);

router.get("/:id", ctrlContacts.getById);

router.post("/", ctrlContacts.create);

router.put("/:id", ctrlContacts.update);

router.patch("/:id", ctrlContacts.patchData);

router.delete("/:id", ctrlContacts.remove);

module.exports = router;
