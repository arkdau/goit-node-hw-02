const fs = require("node:fs/promises");
const path = require("path");

// const baseDir = path.dirname("./");
// const outFileName = path.basename("/models/contacts.json");
// const contactsPath = path.join(baseDir, outFileName);
const contactsPath = './models/contacts.json';


const listContacts = async () => {
  try {
    // console.log("contactsPath: ", contactsPath);
    const data = await fs.readFile(contactsPath, "utf8");
    const parseData = await JSON.parse(data);
    return parseData;
    // console.table(parseData);
  } catch (error) {
    console.log(error);
  }

  // const test = {
  //   text: "func: listContacts"
  // }
  // return test;
};

const getContactById = async (contactId) => {};

const removeContact = async (contactId) => {};

const addContact = async (body) => {};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
