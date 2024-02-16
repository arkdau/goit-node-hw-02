const fs = require("node:fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const baseDir = path.dirname("./db/contacts.json");
const outFileName = path.basename("./db/contacts.json");
const contactsPath = path.join(baseDir, outFileName);

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const parseData = await JSON.parse(data);
    console.table(parseData);
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const parseData = await JSON.parse(data);

    let contact = parseData.find(({ id }) => {
      return id === contactId;
    });
    if (contact !== undefined) {
      return contact;
    } else {
      console.log("the specified id value does not exist");
    }
  } catch (error) {
    console.log(error);
  }
}

async function _writeFile(file, data) {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = fs.writeFile(
    file,
    JSON.stringify(data, null, 2),
    { signal },
  );

  await promise;
}

async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const parseData = await JSON.parse(data);

    const newContacts = parseData.filter((element) => {
      if (element.id !== contactId) {
        return element;
      }
    });

    console.table(newContacts);

    _writeFile(
      contactsPath,
      newContacts,
    );
  } catch (err) {
    console.error(err);
  }
}

async function addContact(name, email, phone) {
  const newContacts = {
    "id": `${nanoid()}`,
    "name": name,
    "email": email,
    "phone": phone,
  };
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    let parseData = await JSON.parse(data);
    parseData = [...parseData, newContacts];

    console.table(parseData);

    _writeFile(
      contactsPath,
      parseData,
    );
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
