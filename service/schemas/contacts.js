const { Schema, model } = require("mongoose");

// const user = new Schema({
//   firstName: {
//     type: String,
//     minlength: 2, // 10
//     required: [true, 'firstName is require']
//   },
//   lastName: String,
//   age: Number,
//   email: {
//     type: String,
//     unique: true,
//   },
//   hobbies: [String],
//   adress: {
//     line1: String,
//     postcode: String,
//   }
// });
//
// const User = model('user', user);
// module.exports = {User}

const contact = new Schema({
  name: {
    type: String,
    minlength: 2, // 10
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

// const User = model("user", contact);
const Contacts = model("contacts", contact);
module.exports =  Contacts 
