const Contacts = require('./schemas/contacts')

const getAllcontacts = async () => {
     return Contacts.find();
}

const getContactById = (id) => {
  return Contacts.findOne({ _id: id })
}

const createContact = async  ({ password, email, subscription, token, owner }) => {
  // return Contacts.create({ password, email, subscription, token, owner })

  // const newUser =  Contacts.create({ password, email, subscription, token, owner })

  const newUser = new Contacts({ password, email, subscription, token, owner }
);
  newUser.setPassword(password);
  await newUser.save();
  return newUser;
}

const updateContact = (id, fields) => {
  return Contacts.findByIdAndUpdate({ _id: id }, fields, { new: true })
}

const removeContact = (id) => {
  return Contacts.deleteOne({ _id: id })
}

const getContactByEmail = (email) => {
  return Contacts.findOne({ email: email })
}

// delete token
// contact.methods.deleteToken = function (token, cb) {
//   let user = this;
//
//   user.update({ $unset: { token: 1 } }, function (err, user) {
//     if (err) return cb(err);
//     cb(null, user);
//   });
// };


module.exports = {
  getAllcontacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
  getContactByEmail,
}

