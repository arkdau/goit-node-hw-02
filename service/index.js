const User = require('./schemas/users')

const getAllcontacts = async () => {
  // return Task.find()
     return User.find();
}

// const getTaskById = (id) => {
//   return Task.findOne({ _id: id })
// }
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
  // getTaskById,
  // createTask,
  // updateTask,
  // removeTask,
}

