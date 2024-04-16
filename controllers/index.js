const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const service = require("../service");
// const User = require("./../service/schemas/contacts");

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
  const { email, password } = req.body;
  const data = req.body;
  // Check if the email and password already exist
  if (email && password) {
    const user = await service.getContactByEmail(email);
    if (user) {
      res.send({
        status: "failure - conflict",
        code: 409,
        message: "email already exists",
      });
    } else {
      try {
        const value = await postDataSchema.validateAsync(data);
        const result = await service.createContact(value);

        res.status(201).json({
          status: "success",
          code: 201,
          message: "User has been registered",
          data: { contact: result },
        });
      } catch (e) {
        res.send({
          status: "failure - validate data",
          code: 400,
          message: e,
        });

        console.error(e);
        next(e);
      }
    }
  } else {
    res.send({
      status: "failure",
      code: 400,
      message: "Bad Request",
    });
  }
  // end Check
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const value = await postDataSchema.validateAsync(data);
    const result = await service.updateContact(id, value);

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
  const data = req.body;

  try {
    const value = await patchDataschema.validateAsync(data);
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

//         home works

// const register = async (req, res) => {
//   const { email, password } = req.body;
//   // console.log("body: ", req);
//
//   if (email && password) {
//     const user = await service.getContactByEmail( email );
//     // const isAlreadyRegistered = users.some((user) => user.email === login);
//     if (user) {
//       res.send({
//         status: "failure",
//         code: 409,
//         message: "email already exists",
//       });
//     } else {
//       // const newUser = {
//       //   id: nanoid(),
//       //   email: req.body.login,
//       //   password: req.body.password,
//       // };
//       // users.push(newUser);
//
//       // const result = await User.create({email, password})
//       const newUser = new User({ email });
//       newUser.setPassword(password);
//       await newUser.save();
//
//       res.send({
//         status: "success",
//         code: 201,
//         message: "User has been registered",
//         // data: result,
//         // data: {email: result.login, password: result.password},
//         // data: { email: newUser.login, password: newUser.password },
//         data: { email: newUser.login },
//       });
//     }
//   } else {
//     res.send({
//       status: "failure",
//       code: 400,
//       message: "Credentials needed",
//     });
//   }
// };

// const register = async (req, res, next) => {
//   const data = req.body;
//   try {
//     const value = await postDataSchema.validateAsync(data);
//     const result = await User.create(value);
//
//     res.status(201).json({
//       status: "success",
//       code: 201,
//       data: { contact: result },
//     });
//   } catch (e) {
//     console.error(e);
//     next(e);
//   }
// };
// /////////////////////////////////////////////////////////
// const login = async (req, res) => {
//   // console.log('/login');
//   const { login, password } = req.body;
//   // array methot  array.some  return bool
//   // const user = users.find((user) =>
//   //   user.login === login && user.password === password
//   // );
//
//   // const user = await User.findOne({login, password});
//   const user = await User.findOne({ login });
//
//   if (user && user.validPassword(password)) {
//     // jwt generation
//     // const header = {
//     //   "alg": "HS256",
//     //   "typ": "JWT",
//     // };
//     const payload = {
//       id: user.id,
//     };
//     // native
//     const jwt = createJWT(payload);
//     // external lib jsonwebtoken
//     const jwt2 = jsonwebtoken.sign(payload, cfg.JWT_SECRET);
//     res.send({
//       status: "success",
//       code: 200,
//       message: "JWT created",
//       data: jwt, //jwt2,
//     });
//   } else {
//     res.send({
//       status: "failure",
//       code: 400,
//       message: "User does not exist",
//     });
//   }
//
//   // res.send("login - ok");
// };
//
// module.exports = login;

// //////////////////////////////////////////////////////////

const cfg = require("./../cfg");

function createJWT(payload) {
  const header = {
    "alg": "HS256",
    "typ": "JWT",
  };

  const createBase64Encoded = (str) => {
    // eslint-disable-next-line no-undef
    return Buffer
      .from(str)
      .toString("base64")
      .replaceAll("=", "") // corresonds to a separator between a key and a value within querystring
      .replaceAll("/", "_")
      .replaceAll("+", "-"); // + corresponds to  the space character
  };
  const headerStr = JSON.stringify(header);
  const headerBase64urlencoded = createBase64Encoded(headerStr);
  // Buffer
  //   .from(headerStr)
  //   .toString("base64")
  //   .replaceAll("=", "") // corresonds to a separator between a key and a value within querystring
  //   .replaceAll("/", "_")
  //   .replaceAll("+", "-");
  const payloadStr = JSON.stringify({
    ...payload,
    iat: Math.round(Date.now() / 1000),
  });
  // eslint-disable-next-line no-undef
  const payloadBase64urlencoded = createBase64Encoded(payloadStr);
  // Buffer
  //   .from(payloadStr)
  //   .toString("base64")
  //   .replaceAll("=", "") // corresonds to a separator between a key and a value within querystring
  //   .replaceAll("/", "_")
  //   .replaceAll("+", "-");

  const firstAndSecondComponents =
    `${headerBase64urlencoded}.${payloadBase64urlencoded}`;
  const signature = crypto
    .createHmac("SHA256", cfg.JWT_SECRET)
    .update(firstAndSecondComponents)
    .digest("base64")
    .replaceAll("=", "") // = corresonds to a separator between a key and a value within querystring
    .replaceAll("/", "_")
    .replaceAll("+", "-"); // + corresponds to  the space character

  return `${firstAndSecondComponents}.${signature}`;
}

const login = async (req, res, next) => {
  const { email, password } = req.body;
  // const data = req.body;
  // Check if the email and password already exist
  if (email && password) {
    const user = await service.getContactByEmail(email);
    if (user && user.validPassword(password)) {
      const payload = {
        id: user.id,
      };
      // native
      const jwt = createJWT(payload);
      // external lib jsonwebtoken
      const jwt2 = jsonwebtoken.sign(payload, cfg.JWT_SECRET);
      console.log("jwt: ", jwt);
      console.log("jwt2: ", jwt2);
      res.send({
        status: "success",
        code: 200,
        message: "JWT created",
        data: jwt, // jwt2
      });
    } else {
      res.send({
        status: "failure",
        code: 400,
        message: "User does not exist",
      });
    }
  } else {
    res.send({
      status: "failure",
      code: 400,
      message: "Bad Request",
    });
  }
  // end Check
};

module.exports = {
  get,
  getById,
  create,
  update,
  patchData,
  remove,
  // register,
  login,
};
