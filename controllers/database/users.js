const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const service = require("./../../service");

const { postDataSchema, patchDataschema } = require("./../validation/user");

const cfg = require("./../../cfg");

const path = require("path");
const gravatar = require("gravatar");
const { rename, unlink } = require("fs/promises");
const Jimp = require("jimp");
const Users = require("../../service/schemas/users");

const get = async (req, res, next) => {
  try {
    const results = await service.getAllusers();
    res.json({
      status: "success",
      code: 200,
      data: {
        users: results,
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
    const result = await service.getUserById(id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { user: result },
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

const getByVerifyToken = async (req, res) => {
  const { verificationToken } = req.params;
  try {
    const result = await service.getUserByVerifyToken(verificationToken);
    if (result) {
      // result.verificationToken = null;
      // result.verify = true;
      res.json({
        status: "success",
        code: 200,
        data: { user: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found user: ${verificationToken}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
  }
};

const create = async (req, res, next) => {
  const { email, password } = req.body;
  const data = req.body;
  // Check if the email and password already exist
  if (email && password) {
    const user = await service.getUserByEmail(email);
    if (user) {
      res.setHeader("Connection", "close");
      res.send({
        status: "failure - conflict",
        code: 409,
        message: "email already exists",
      });
      res.end();
    } else {
      try {
        const value = await postDataSchema.validateAsync(data);
        const result = await service.createUser(value);

        // send an email to the user's e-mail address and indicate
        // the email verification link (/users/verify/:verificationToken) in the message;

        const sendStatus = await service.sendMailer({
          to: email,
          subject: "Verification link",
          text: "This is the user verification link,  Please confirm it.",
          html:
            `<strong>This is the user verification link,  Please confirm it.</strong><br><a href="http://localhost:3000/users/verify/${result.verificationToken}">/users/verify/${result.verificationToken}</a>`,
        });

        // res.setHeader("Connection", "close");
        res.status(201).json({
          status: "success",
          code: 201,
          message: "User has been registered",
          data: { user: result },
        });
        // if (sendStatus.status) {
        //   res.send(sendStatus.message);
        // } else {
        //   res.status(400).send(sendStatus.message);
        // }

        // res.end();
      } catch (e) {
        // res.setHeader("Connection", "close");
        res.send({
          status: "failure - validate data",
          code: 400,
          message: e,
        });

        res.end();
        console.error(e);
        next(e);
      }
    }
  } else {
    res.setHeader("Connection", "close");
    res.send({
      status: "failure",
      code: 400,
      message: "Bad Request",
    });

    res.end();
  }
  // end Check
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const value = await postDataSchema.validateAsync(data);
    const result = await service.updateUser(id, value);

    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { user: result },
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
    const result = await service.updateUser(id, value);
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
    const result = await service.removeUser(id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { user: result },
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

  if (email && password) {
    const user = await service.getUserByEmail(email);

    if (user && user.validPassword(password)) {
      const payload = {
        id: user.id,
      };
      // native
      const jwt = createJWT(payload);
      // external lib jsonwebtoken
      const jwt2 = jsonwebtoken.sign(payload, cfg.JWT_SECRET);

      const options = {
        maxAge: 20 * 60 * 1000, // would expire in 20minutes
        httpOnly: true, // The cookie is only accessible by the web server
        secure: true,
        sameSite: "None",
      };
      res.cookie("SessionID", jwt, options); // set the token to response header, so that the client sends it back on each subsequent request

      service.updateUser(user.id, { token: jwt });

      res.setHeader("Connection", "close");
      res.send({
        status: "success",
        code: 200,
        message: "JWT created",
        token: jwt, // jwt2
        user: {
          email: email,
          subscription: user.subscription,
        },
      });
      res.end();
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
  // req.end();
};

const logout = async (req, res, next) => {
  const { id } = req.user;

  try {
    const result = await service.updateUser(id, { token: null });
    if (result) {
      res.json({
        status: "success",
        code: 204,
        message: "You are logged out!",
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
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
  res.end();
};

const jwtAuth = async (req, res, next) => {
  const auth = req.headers.authorization; // Bearer token
  if (auth) {
    const token = auth.split(" ")[1];
    try {
      const payload = jsonwebtoken.verify(token, cfg.JWT_SECRET);
      const user = await service.getUserById({
        _id: payload.id,
      });

      if (user && (user.token === token)) {
        req.user = user;
        next();
      } else if (!user) {
        res.send({
          status: "failure",
          code: 401,
          message: "No user",
        });
      } else if (user.token === null) {
        res.send({
          status: "failure",
          code: 401,
          message: "This session has expired. Please login",
        });
      } else if (user.token !== token) {
        res.send({
          status: "failure",
          code: 401,
          message: "bad token",
        });
      }
    } catch (err) {
      res.send({
        status: "failure",
        code: 401,
        message: "Wrong token",
      });
    }
  } else {
    res.send({
      status: "failure",
      code: 401,
      message: "Not authorized",
    });
  }
};

const current = (req, res) => {
  res.send({
    status: "success",
    code: 200,
    data: {
      email: req.user.email,
      subscription: req.user.subscription,
    }, // users.map(user => {return { id: req.user.id, login: req.user.login }}),
    message: "User current",
  });
};

async function resize(temporaryName, finalFileName, pxdx, pxdy) {
  const DEST_DIR = path.join(__dirname, "./../../public/avatars/");
  // Read the image.
  const image = await Jimp.read(temporaryName);
  // Resize the image to width 150 and heigth 150.
  await image.resize(pxdx, pxdy);
  // Save and overwrite the image
  await image.writeAsync(temporaryName);

  // rename file and remove to /public/avatars/
  const fileName = path.join(DEST_DIR, finalFileName);
  try {
    await rename(temporaryName, fileName);
  } catch (err) {
    await unlink(temporaryName);
    return next(err);
  }
}

const avatars = async (req, res) => {
  // Names files
  const { path: temporaryName, originalname } = req.file;
  const fileExt = path.extname(originalname);
  user = req.user;
  const finalFileName = `${user.email}-${Date.now()}_250x250${fileExt}`;

  // resize file
  resize(temporaryName, finalFileName, 250, 250);
  // create - Gravatar images
  const url = gravatar.url(user.email, {
    s: "100",
    r: "x",
    d: "identicon",
  }, false);

  // Update user
  const data = { avatarURL: url };
  try {
    const result = await service.updateUser(user._id, data);

    if (result) {
      res.json({
        status: "success",
        code: 200,
        message: "Update avatar",
        ResponseBody: {
          "avatarURL": user.avatarURL,
        },
      });
    } else {
      res.status(401).json({
        status: "Unauthorized",
        code: 404,
        ResponseBody: {
          "message": "Not authorized",
        },
      });
    }
  } catch (e) {
    console.error(e);
  }
};

// Status: 200 OK
// ResponseBody: {
//   message: 'Verification successful',
// }

// Status: 404 Not Found
// ResponseBody: {
//   message: 'User not found'
// }

const verify = async (req, res) => {
  const verificationToken = req.params;
  const user = await service.getUserByVerifyToken(verificationToken);

  if (user) {
  //     const user = await service.getUserById({
  //       _id: payload.id,
  //     });
    const verification = service.updateUser(user._id, {verify: true, verificationToken: null,})
    // user.verificationToken = null;
    // user.verify = true;

    res.setHeader("Connection", "close");
    res.json({
      status: "OK",
      code: 200,
      ResponseBody: {
        message: "Verification successful",
      },
    });
    res.end();
  } else {
    res.setHeader("Connection", "close");
    res.status(404).json({
      status: "Not Found",
      code: 404,
      ResponseBody: {
        "message": "User not found",
      },
    });
    res.end();
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  patchData,
  remove,
  login,
  logout,
  jwtAuth,
  current,
  avatars,
  verify,
};
