// const User = require('./schemas/users')
const Contacts = require('./schemas/contacts')

const getAllcontacts = async () => {
  // return Task.find()
     return Contacts.find();
}

const getContactById = (id) => {
  return Contacts.findOne({ _id: id })
}
//
// const createTask = ({ title, text }) => {
//   return Task.create({ title, text })
// }
//
// const updateTask = (id, fields) => {
//   return Task.findByIdAndUpdate({ _id: id }, fields, { new: true })
// }
//
// const removeTask = (id) => {
//   return Task.findByIdAndRemove({ _id: id })
// }

module.exports = {
  getAllcontacts,
  getContactById,
  // createTask,
  // updateTask,
  // removeTask,
}

