const Joi = require("joi");

// const postDataSchema = Joi.object().keys({
//   name: Joi.string().regex(/^[A-Z]+ [A-Z]+$/i).required(),
//   email: Joi.string().email().required(),
//   phone: Joi.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/).required(),
//   favorite: Joi.bool().required(),
// });

const postDataSchema = Joi.object().keys({
  // password: Joi.string().regex(/^\d{4}$/).required(),
  password: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
});

const patchDataschema = Joi.object().keys({
  id: Joi.string(),
  password: Joi.string(),
  email: Joi.string().email(),
  subscription: Joi.string().equal("starter", "pro", "business"),
  token: Joi.string(),
})
  .or("password", "email", "subscription", "token");

module.exports = {
  postDataSchema,
  patchDataschema,
};
