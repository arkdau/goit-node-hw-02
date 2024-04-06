const Joi = require("joi");

const postDataSchema = Joi.object().keys({
  name: Joi.string().regex(/^[A-Z]+ [A-Z]+$/i).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/).required(),
  favorite: Joi.bool().required(),
});

const patchDataschema = Joi.object().keys({
  name: Joi.string().regex(/^[A-Z]+ [A-Z]+$/i),
  email: Joi.string().email(),
  phone: Joi.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/),
  favorite: Joi.bool(),
})
  .or("name", "email", "phone", "favorite");

module.exports = {
  postDataSchema,
  patchDataschema,
};
