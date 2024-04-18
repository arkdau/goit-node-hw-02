const Contacts = require("./schemas/contacts");
const Users = require("./schemas/users");

const getAllcontacts = async () => {
  return Contacts.find();
};

const getUserById = (id) => {
  return Users.findOne({ _id: id });
};

const getUserByEmail = (email) => {
  return Users.findOne({ email: email });
};

const updateUser = async (id, fields) => {
  return await Users.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const createContact = async (
  { password, email, subscription, token, owner },
) => {
  const newContact = new Contacts({
    password,
    email,
    subscription,
    token,
    owner,
  });
  newContact.setPassword(password);
  await newContact.save();
  return newContact;
};

const createUser = async ({ password, email, subscription, token, owner }) => {
  const newUser = new Users({ password, email, subscription, token, owner });
  newUser.setPassword(password);
  await newUser.save();
  return newUser;
};

const updateContact = async (id, fields) => {
  return await Contacts.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const removeContact = (id) => {
  return Contacts.deleteOne({ _id: id });
};

module.exports = {
  getAllcontacts,
  getUserById,
  createContact,
  createUser,
  updateContact,
  removeContact,
  getUserByEmail,
  updateUser,
};
