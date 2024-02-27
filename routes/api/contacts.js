// const express = require("express");
// // const { User } = require("./users.schema");
//
// const router = express.Router();
//
//
//
//
//
//
// // const express = require("express");
// // const {
// //   listContacts,
// //   getContactById,
// //   addContact,
// //   removeContact,
// //   updateContact,
// // } = require(
// //   "../../models/contacts",
// // );
//
// // const { nanoid } = require("nanoid");
// const { postDataSchema, putDataschema } = require("./validation");
//
// // const router = express.Router();
//
// router.get("/", async (req, res, next) => {
//   const contacts = await listContacts();
//   if (contacts) {
//     res.send({
//       status: "success",
//       code: 200,
//       data: contacts,
//     });
//   } else {
//     res.status(500).send({
//       status: "failure",
//       code: 500,
//       message: "Internal Server Error",
//     });
//   }
// });
//
// router.get("/:contactId", async (req, res, next) => {
//   const id = req.params.contactId;
//   const contact = await getContactById(id);
//   if (contact) {
//     res.send({
//       status: "success",
//       code: 200,
//       data: contact,
//     });
//   } else {
//     res.status(404).send({
//       status: "failure",
//       code: 404,
//       message: "Not found",
//     });
//   }
// });
//
// router.post("/", async (req, res) => {
//   const data = req.body;
//
//   try {
//     const value = await postDataSchema.validateAsync(data);
//     const newBody = Object.assign({ id: nanoid() }, value);
//
//     const contact = await addContact(newBody);
//
//     res.status(201).send({
//       status: "success",
//       code: 201,
//       data: contact,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "error",
//       code: 422,
//       message: "missing required name - field",
//       error: err,
//     });
//   }
// });
//
// router.delete("/:contactId", async (req, res, next) => {
//   const id = req.params.contactId;
//   const status = await removeContact(id);
//   if (status === null) {
//     res.status(404).send({
//       status: "failure",
//       code: 404,
//       message: "Not found",
//     });
//   } else {
//     res.status(200).send({
//       status: "success",
//       code: 200,
//       message: "contact deleted",
//     });
//   }
// });
//
// router.put("/:contactId", async (req, res, next) => {
//   const data = req.body;
//   const id = req.params.contactId;
//
//   try {
//     const value = await putDataschema.validateAsync(data);
//     const contact = await updateContact(id, value);
//
//     if (contact === null) {
//       res.status(404).send({
//         status: "failure",
//         code: 404,
//         message: "Not found",
//       });
//     } else {
//       res.status(200).send({
//         status: "success",
//         code: 200,
//         data: contact,
//       });
//     }
//   } catch (err) {
//     res.status(400).json({
//       status: "error",
//       code: 422,
//       message: "missing fields",
//       error: err,
//     });
//   }
// });
//
// module.exports = router;
