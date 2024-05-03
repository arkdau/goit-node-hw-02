const bCrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');
// const { Schema, default: mongoose } = require("mongoose");

const { Schema, model } = require("mongoose");

const users = new Schema({
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
  avatarURL: {
    type: String,
    default: null,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});

users.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

users.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

users.methods.setAvatar = function (url) {
  this.avatarURL = url;
};

users.methods.setToken = function () {
  this.verificationToken = uuidv4();
};

const Users = model("Users", users);

module.exports = Users;
