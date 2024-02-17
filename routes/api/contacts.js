const express = require("express");
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require(
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
  const data = req.body;

  const schema = Joi.object().keys({
    name: Joi.string().regex(/^[A-Z]+ [A-Z]+$/i).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/).required(),
  });

  try {
    const value = await schema.validateAsync(data);
    const newBody = Object.assign({ id: nanoid() }, value);

    const contact = await addContact(newBody);

    res.status(201).send({
      status: "success",
      code: 201,
      data: contact,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      code: 422,
      message: "missing required name - field",
      error: err,
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
  const data = req.body;
  const id = req.params.contactId;

  const schema = Joi.object().keys({
    name: Joi.string().regex(/^[A-Z]+ [A-Z]+$/i),
    email: Joi.string().email(),
    phone: Joi.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/),
  })
    .or("name", "email", "phone");

  try {
    const value = await schema.validateAsync(data);
    const contact = await updateContact(id, value);

    if (contact === null) {
      res.status(404).send({
        status: "failure",
        code: 404,
        message: "Not found",
      });
    } else {
      res.status(200).send({
        status: "success",
        code: 200,
        data: contact,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "error",
      code: 422,
      message: "missing fields",
      error: err,
    });
  }
});

module.exports = router;
