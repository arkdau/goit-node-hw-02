const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const service = require("./../../service");

const cfg = require("./../../cfg");
const { postDataSchema, patchDataschema } = require("./../validation/user");


const path = require("path");

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
    const user = await service.getUserByEmail(email);
    if (user) {
      res.send({
        status: "failure - conflict",
        code: 409,
        message: "email already exists",
      });
    } else {
      try {
        const value = await postDataSchema.validateAsync(data);
        const result = await service.createUser(value);

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
  // service.getUserById();
  if (auth) {
    const token = auth.split(" ")[1];
    try {
      // const jwt = token.verify(token, cfg.JWT_SECRET);
      const payload = jsonwebtoken.verify(token, cfg.JWT_SECRET);
      // const user = await User.findOne({
      //   _id: payload.id,
      // })
      const user = await service.getUserById({
        _id: payload.id,
      });

      // const user = users.find((user) => user.id === payload.id);
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

// const { stat, mkdir } = require("fs/promises");
// const multer = require("multer");
// const path = require("path");
//
//
//   // const UPLOAD_DIR = path.join(__dirname, "public", "avatars");
//   const UPLOAD_DIR = path.join(__dirname, "./../../tmp");
//
//   // double check that  the dir exists
//   stat(UPLOAD_DIR).catch(() => mkdir(UPLOAD_DIR, { recursive: true }));
//
//   const storage = multer.diskStorage({
//     destination: function (_, __, cb) {
//       // check ext and decide where the fils should go
//       cb(null, UPLOAD_DIR);
//     },
//     filename: function (_, file, cb) {
//       const fileExt = path.extname(file.originalname);
//       const fileNameWithoutExt = path.basename(file.originalname, fileExt);
//       const finalFileName = `${fileNameWithoutExt}-${Date.now()}${fileExt}`;
//       // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//       // cb(null, file.fieldname + "-" + uniqueSuffix);
//       cb(null, finalFileName);
//     },
//   });
//
//   const upload = multer({
//     // dest: UPLOAD_DIR,
//     storage,
//     limits: {
//       fileSize: 4 * 1024 * 1024, // 1MB
//     },
//   });



const gravatar = require('gravatar');
const { copyFile, rename, unlink } = require("fs/promises");
const DEST_DIR = path.join(__dirname, "./../../public/avatars/");
// const avatars = (upload.single("picture"), (req, res) => {
const avatars = async (req, res) => {


// const { description } = req.body;

//   copyFile('source.txt', 'destination.txt', (err) => {
//   if (err) throw err;
//   console.log('source.txt was copied to destination.txt');
// // });

 // http://localhost:<port>/avatars/<nazwa pliku z rozszerzeniem>

  // app.patch("/users/avatars", upload.single("picture"), (req, res) => {
    // if (req.file) {
    //   res.send({
    //     code: 201,
    //     status: "SUCCES",
    //     message: "The file has been created",
    //   });
    // } else {
    //   res.send({
    //     code: 400,
    //     status: "FAILURE",
    //     message: "The file cannot be stored",
    //   });
    // }
  // });


  const { path: temporaryName, originalname } = req.file;

// Jimp.read(originalname)
//   .then((lenna) => {
//     return lenna
//       .resize(256, 256) // resize
//       .quality(60) // set JPEG quality
//       .greyscale() // set greyscale
//       .write("lena-small-bw.jpg"); // save
//   })
//   .catch((err) => {
//     console.error(err);
//   });


  const fileExt = path.extname(originalname);
  const fileNameWithoutExt = path.basename(originalname, fileExt);
  const finalFileName = `${fileNameWithoutExt}-${Date.now()}_250x250${fileExt}`;




  const Jimp = require('jimp');
  async function resize() {
  // Read the image.
  const image = await Jimp.read(temporaryName);
  // Resize the image to width 150 and heigth 150.
  await image.resize(250, 250);
  // Save and overwrite the image
  // await image.writeAsync(`test/${Date.now()}_250x250.png`);

  // await image.writeAsync(`test/${Date.now()}_250x250.png`);
  await image.writeAsync(temporaryName);


  // const fileName = path.join(DEST_DIR, originalname);
  const fileName = path.join(DEST_DIR, finalFileName);
  try {
    await rename(temporaryName, fileName);
  } catch (err) {
    await unlink(temporaryName);
    return next(err);
  }






}
resize();



















  // res.json({ description, message: 'Plik załadowany pomyślnie', status: 200 });


  // const auth = req.headers.authorization; // Bearer token
//     const token = auth.split(" ")[1];
//       const payload = jsonwebtoken.verify(token, cfg.JWT_SECRET);
// const user = await service.getUserById({
//   _id: payload.id,
// });

  user = req.user;
  
  // console.log("user avatarURL: ", user.avatarURL);
  //
  

const url = gravatar.url(user.email, {
  s: "100",
  r: "x",
  d: "retro",
}, false);


  // const { _id } = req.params;
  const data = {avatarURL : url};
try {
  // const value = await postDataSchema.validateAsync(data);
  const result = await service.updateUser(user._id, data);
                                                          
  // if (result) {
  //   res.json({
  //     status: "success",
  //     code: 200,
  //     data: { contact: result },
  //   });
  // } else {
  //   res.status(404).json({
  //     status: "error",
  //     code: 404,
  //     message: `Not found task id: ${id}`,
  //     data: "Not Found",
  //   });
  // }
} catch (e) {
  console.error(e);
  // next(e);
}








  res.send({
    status: "success",
    code: 200,
    // data: {
    //   email: req.user.email,
    //   subscription: req.user.subscription,
    // }, // users.map(user => {return { id: req.user.id, login: req.user.login }}),
    message: "Update avatar",
    ResponseBody: {
      "avatarURL": user.avatarURL,
    },
  });
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
};