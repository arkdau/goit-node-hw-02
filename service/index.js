const Contacts = require("./schemas/contacts");
const Users = require("./schemas/users");
const gravatar = require("gravatar");

const getAllcontacts = async () => {
  return Contacts.find();
};

const getContactById = (id) => {
  return Contacts.findOne({ _id: id });
};

const createContact = ({ name, email, phone, favorite }) => {
  return Contacts.create({ name, email, phone, favorite });
};

const updateContact = async (id, fields) => {
  return await Contacts.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const removeContact = (id) => {
  return Contacts.deleteOne({ _id: id });
};

// Users

const getAllusers = async () => {
  return Users.find();
};

const getUserById = (id) => {
  return Users.findOne({ _id: id });
};

const getUserByEmail = (email) => {
  return Users.findOne({ email: email });
};

const createUser = async (
  { password, email, subscription, token, owner, avatarURL, verify, verificationToken },
) => {
  const newUser = new Users({
    password,
    email,
    subscription,
    token,
    owner,
    avatarURL,
    verify,
    verificationToken,
  });
  const url = gravatar.url(email, {
    s: "100",
    r: "x",
    d: "retro",
  }, false);
  newUser.setPassword(password);
  newUser.setAvatar(url);
  newUser.setToken();
  await newUser.save();
  return newUser;
};

const updateUser = async (id, fields) => {
  return await Users.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const removeUser = (id) => {
  return Users.deleteOne({ _id: id });
};

module.exports = {
  getAllcontacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
};
