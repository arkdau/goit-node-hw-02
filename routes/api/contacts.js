const express = require("express");
const { listContacts, getContactById, addContact, removeContact } = require(
  "../../models/contacts",
);
const { nanoid } = require("nanoid");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  if (contacts) {
    res.send({
      status: "success",
      code: 200,
      data: contacts,
    });
  } else {
    res.status(500).send({
      status: "failure",
      code: 500,
      message: "Internal Server Error",
    });
  }
});

router.get("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const contact = await getContactById(id);
  if (contact) {
    res.send({
      status: "success",
      code: 200,
      data: contact,
    });
  } else {
    res.status(404).send({
      status: "failure",
      code: 404,
      message: "Not found",
    });
  }
});

router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(400).send({
      status: "failure",
      code: 400,
      message: "missing required name - field",
    });
  } else {
    const newBody = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    // tasks.push(newTask);
    const contact = await addContact(newBody);

    res.status(201).send({
      status: "success",
      code: 201,
      data: contact,
    });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  // res.json({ message: "template message" });
  const id = req.params.contactId;
  const status = await removeContact(id);
  if (status === null) {
    res.status(404).send({
      status: "failure",
      code: 404,
      message: "Not found",
    });
  } else {
    res.status(200).send({
      status: "success",
      code: 200,
      message: "contact deleted",
    });
  }
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
