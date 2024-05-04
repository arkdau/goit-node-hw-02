const Contacts = require("./schemas/contacts");
const Users = require("./schemas/users");
const gravatar = require("gravatar");
const { sendMailSendGrid } = require("./email/mail");

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

const getUserByVerifyToken = (verificationToken) => {
  return Users.findOne(verificationToken);
  // return await Users.findByIdAndUpdate({ _id: id }, fields, { new: true });

};

const createUser = async (
  {
    password,
    email,
    subscription,
    token,
    owner,
    avatarURL,
    verify,
    verificationToken,
  },
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

const sendMailer = async ({ to, subject, text, html }) => {
  const from = "akson_control@o2.pl";
  // const { to, subject, text } = req.body;

  // let sendMailer = process.env.MAIL_SENDER === "SEND_GRID"
  // ? sendMailSendGrid
  // : sendMailNodeMailer;

  sendMailSendGrid({ to, from, subject, text, html })
    .then(() => {
      console.log("The mail has been sent");
    })
    .catch((err) => {
      console.log(`The mail cannot be sent: ${err.message}`);
    });
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
  sendMailer,
  getUserByVerifyToken,
};
