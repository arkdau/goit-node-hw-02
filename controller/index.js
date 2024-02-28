const service = require("../service");
const { postDataSchema, patchDataschema } = require("./validation");

const get = async (req, res, next) => {
  try {
    const results = await service.getAllcontacts();
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await service.getContactById(id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found task id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const create = async (req, res, next) => {
  const data = req.body;
  // const { name, email, phone, favorite } = req.body;
  try {
    const value = await postDataSchema.validateAsync(data);
    const result = await service.createContact(value);

    // const result = await service.createContact({
    //   name,
    //   email,
    //   phone,
    //   favorite,
    // });

    res.status(201).json({
      status: "success",
      code: 201,
      data: { contact: result },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  // const { name, email, phone, favorite } = req.body;
  const data = req.body;
  try {
    const value = await postDataSchema.validateAsync(data);
    const result = await service.updateContact(id, value);

    // const result = await service.updateContact(id, {
    //   name,
    //   email,
    //   phone,
    //   favorite,
    // });
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found task id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const patchData = async (req, res, next) => {
  const { id } = req.params;
  // const { name = "" } = req.body;
  const data = req.body;

  try {
    const value = await patchDataschema.validateAsync(data);
    // const result = await service.updateContact(id, { name });
    const result = await service.updateContact(id, value);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { conatact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found task id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

// const updateEmail = async (req, res, next) => {
//   const { id } = req.params;
//   // const { email = "" } = req.body;
//   const data = req.body;
//
//   try {
//     const value = await patchDataschema.validateAsync(data);
//     const result = await service.updateContact(id, value);
//     // const result = await service.updateContact(id, { email });
//     if (result) {
//       res.json({
//         status: "success",
//         code: 200,
//         data: { conatact: result },
//       });
//     } else {
//       res.status(404).json({
//         status: "error",
//         code: 404,
//         message: `Not found task id: ${id}`,
//         data: "Not Found",
//       });
//     }
//   } catch (e) {
//     console.error(e);
//     next(e);
//   }
// };
//
// const updatePhone = async (req, res, next) => {
//   const { id } = req.params;
//   // const { phone = "" } = req.body;
//   const data = req.body;
//
//   try {
//     const value = await patchDataschema.validateAsync(data);
//     const result = await service.updateContact(id, value);
//     // const result = await service.updateContact(id, { phone });
//     if (result) {
//       res.json({
//         status: "success",
//         code: 200,
//         data: { conatact: result },
//       });
//     } else {
//       res.status(404).json({
//         status: "error",
//         code: 404,
//         message: `Not found task id: ${id}`,
//         data: "Not Found",
//       });
//     }
//   } catch (e) {
//     console.error(e);
//     next(e);
//   }
// };
//
// const updateFavorite = async (req, res, next) => {
//   const { id } = req.params;
//   // const { favorite = "" } = req.body;
//   const data = req.body;
//
//   try {
//     const value = await patchDataschema.validateAsync(data);
//     const result = await service.updateContact(id, value);
//     // const result = await service.updateContact(id, { favorite });
//     if (result) {
//       res.json({
//         status: "success",
//         code: 200,
//         data: { conatact: result },
//       });
//     } else {
//       res.status(404).json({
//         status: "error",
//         code: 404,
//         message: `Not found task id: ${id}`,
//         data: "Not Found",
//       });
//     }
//   } catch (e) {
//     console.error(e);
//     next(e);
//   }
// };

const remove = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await service.removeContact(id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found task id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  patchData,
  // updateEmail,
  // updatePhone,
  // updateFavorite,
  remove,
};
