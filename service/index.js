// const User = require('./schemas/users')
const Contacts = require('./schemas/contacts')

const getAllcontacts = async () => {
  // return Task.find()
     return Contacts.find();
}

const getContactById = (id) => {
  return Contacts.findOne({ _id: id })
}

const createContact = ({ name, email, phone, favorite }) => {
  return Contacts.create({ name, email, phone, favorite })
}

const updateContact = (id, fields) => {
  return Contacts.findByIdAndUpdate({ _id: id }, fields, { new: true })
}

const removeContact = (id) => {
  return Contacts.deleteOne({ _id: id })
}

module.exports = {
  getAllcontacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
}

