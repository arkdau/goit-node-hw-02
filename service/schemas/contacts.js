// const { Schema, model } = require("mongoose");
const bCrypt = require("bcryptjs");
const { Schema, default: mongoose } = require("mongoose");

// const contact = new Schema({
//   name: {
//     type: String,
//     minlength: 2,
//     required: [true, "Set name for contact"],
//   },
//   email: {
//     type: String,
//     unique: true,
//   },
//   phone: {
//     type: String,
//     unique: true,
//   },
//   favorite: {
//     type: Boolean,
//     default: false,
//   },
// });

// home works

const contact = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

// const Contacts = model("contacts", contact);
// module.exports = Contacts;

contact.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

contact.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};




module.exports = mongoose.model("User", contact);
