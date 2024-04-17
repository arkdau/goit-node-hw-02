const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const service = require("../service");
const Blacklist = require("../service/schemas/blacklist");
// const User = require("./../service/schemas/contacts");

const cfg = require("./../cfg");
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

// const cfg = require("./../cfg");

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
    // const validPassword = user.validPassword(password);

    if (user && user.validPassword(password)) {
      const payload = {
        id: user.id,
      };
      // native
      const jwt = createJWT(payload);
      // external lib jsonwebtoken
      const jwt2 = jsonwebtoken.sign(payload, cfg.JWT_SECRET);
      // const data = {token: jwt};
      // if (jwt) {
      //
      //   service.updateContact(user.id, data);
      // }
      // console.log("user: ", user);


      const options = {
            maxAge: 20 * 60 * 1000, // would expire in 20minutes
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true,
            sameSite: "None",
        };
      // res.cookie("SessionID", jwt, options);
      res.cookie("SessionID", jwt, options); // set the token to response header, so that the client sends it back on each subsequent request
      console.log("jwt: ", jwt);
      console.log("jwt2: ", jwt2);
      res.send({
        status: "success",
        code: 200,
        message: "JWT created",
        data: jwt, // jwt2
        user: {
          email: email,
          subscription: user.subscription,
        },
      });
    } else if (user === null) {
      res.send({
        status: "failure",
        code: 401,
        message: "User does not exist",
      });
    } else {
      res.send({
        status: "failure",
        code: 401,
        message: "bad password",
      });
    }
  } else {
    res.send({
      status: "failure",
      code: 400,
      message: "Bad Request",
    });
  }
};

// const logout = async (req, res, next) => {
//   const { id } req.user;
//   // const data = req.user;
//   // data.token = null;
//
// // "_id" : ObjectId("661ef5f5cf53cf2c87df3974"),
// //     "password" : "$2a$06$HAFJTJcxP4M2P/eMPe.ZO.8AglIOwCycHQNPA9exN8OQn1Wg.q.yq",
// //     "email" : "alicjatricity1978@wp.pl",
// //     "subscription" : "starter",
// //     "token" : null,
//
//
//
//
//   const data = {
//   // id: req.user.id,
//   // password: req.user.password,
//   // email: req.user.email,
//   // subscription: req.user.subscription,
//   token: null,
// }
//
//
//   try {
//     // const value = await patchDataschema.validateAsync(data);
//     const result = await service.updateContact(id, data);
//     if (result) {
//       res.json({
//         status: "success",
//         code: 204,
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

// req.user.deleteToken(req.token,(err,user)=>{
//            if(err) return res.status(400).send(err);
//            res.sendStatus(200);

// const logout = async (req, res, next) => {
//   // req.user.deleteToken(req.token, (err, user) => {
//   //   if (err) return res.status(400).send(err);
//   //   res.sendStatus(200);
//   // });
//   console.log("token ", req.token);
// };

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.cookie; // get the session cookie from request header
    if (!authHeader) return res.sendStatus(204); // No content
    const cookie = authHeader.split("=")[1]; // If there is, split the cookie string to get the actual jwt token
    const accessToken = cookie.split(";")[0];
    const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted
    // if true, send a no content response.
    if (checkIfBlacklisted) return res.sendStatus(204);
    // otherwise blacklist token
    const newBlacklist = new Blacklist({
      token: accessToken,
    });
    await newBlacklist.save();
    // Also clear request cookie on client
    res.setHeader("Clear-Site-Data", '"cookies"');
    res.status(200).json({ message: "You are logged out!" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
  res.end();
};

// verify
const jwtAuth = async (req, res, next) => {
  const authHeader = req.headers.cookie; // get the session cookie from request header

  if (!authHeader) return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
  const cookie = authHeader.split("=")[1]; // If there is, split the cookie string to get the actual jwt token
  const accessToken = cookie.split(";")[0];
  const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted
  // if true, send an unathorized message, asking for a re-authentication.
  if (checkIfBlacklisted) {
    return res
      .status(401)
      .json({ message: "This session has expired. Please login" });
  }
  // if token has not been blacklisted, verify with jwt to see if it has been tampered with or not.
  // that's like checking the integrity of the accessToken
  jsonwebtoken.verify(accessToken, cfg.JWT_SECRET, async (err, decoded) => {
    if (err) {
      // if token has been altered, return a forbidden error
      return res
        .status(401)
        .json({ message: "This session has expired. Please login" });
    }

    const { id } = decoded; // get user id from the decoded token
    // const user = await User.findById(id); // find user by that `id`
    const user = await service.getContactById({
      _id: id,
    });
    const { password, ...data } = user._doc; // return user object but the password
    req.user = data; // put the data object into req.user
    next();
  });
};

// export async function Logout(req, res) {
//   try {
//     const authHeader = req.headers['cookie']; // get the session cookie from request header
//     if (!authHeader) return res.sendStatus(204); // No content
//     const cookie = authHeader.split('=')[1]; // If there is, split the cookie string to get the actual jwt token
//     const accessToken = cookie.split(';')[0];
//     const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted
//     // if true, send a no content response.
//     if (checkIfBlacklisted) return res.sendStatus(204);
//     // otherwise blacklist token
//     const newBlacklist = new Blacklist({
//       token: accessToken,
//     });
//     await newBlacklist.save();
//     // Also clear request cookie on client
//     res.setHeader('Clear-Site-Data', '"cookies"');
//     res.status(200).json({ message: 'You are logged out!' });
//   } catch (err) {
//     res.status(500).json({
//       status: 'error',
//       message: 'Internal Server Error',
//     });
//   }
//   res.end();
// }

// const jwtAuth = async (req, res, next) => {
//   const auth = req.headers.authorization; // Bearer token
//   if (auth) {
//     const token = auth.split(" ")[1];
//     try {
//       // const jwt = token.verify(token, cfg.JWT_SECRET);
//       const payload = jsonwebtoken.verify(token, cfg.JWT_SECRET);
//       // const user = await User.findOne({
//       //   _id: payload.id,
//       // })
//       const user = await service.getContactById({
//         _id: payload.id,
//       });
//
//       // const user = users.find((user) => user.id === payload.id);
//       if (user) {
//         req.user = user;
//         next();
//       } else {
//         res.send({
//           status: "failure",
//           code: 401,
//           message: "No user",
//         });
//       }
//     } catch (err) {
//       res.send({
//         status: "failure",
//         code: 401,
//         message: "Wrong token",
//       });
//     }
//   } else {
//     res.send({
//       status: "failure",
//       code: 401,
//       message: "Not authorized",
//     });
//   }
// };

const current = (req, res) => {
  res.send({
    status: "success",
    code: 200,
    data: {
      id: req.user.id,
      password: req.user.password,
      email: req.user.email,
      subscription: req.user.subscription,
      token: req.user.token,
    }, // users.map(user => {return { id: req.user.id, login: req.user.login }}),
    message: "User current",
  });
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
  logout,
  jwtAuth,
  current,
};
