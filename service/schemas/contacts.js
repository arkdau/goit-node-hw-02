// const { Schema, model } = require("mongoose");
const { Schema, default: mongoose } = require("mongoose");

const contact = new Schema({
  name: {
    type: String,
    minlength: 2,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("contacts", contact);
