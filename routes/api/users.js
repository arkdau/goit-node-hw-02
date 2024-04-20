// const Contacts = require("./api/contacts");
// const Users = require("./api/users");

// const express = require("express");
// const router = express.Router();

const { router } = require("./../index");
const ctrlUser = require("../../controllers/database/users.js");

// router.post("/", ctrlUser.create);

// router.put("/:id", ctrlUser.update);

// router.patch("/:id", ctrlUser.patchData);

// router.delete("/:id", ctrlUser.remove);

router.post("/signup", ctrlUser.create);
router.post("/login", ctrlUser.login);
router.get("/logout", ctrlUser.jwtAuth, ctrlUser.logout);
router.get("/current", ctrlUser.jwtAuth, ctrlUser.current);

module.exports = router
