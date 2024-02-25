/* eslint-env browser */
/* eslint no-undef: "error" */

const fs = require("node:fs/promises");
const path = require("path");

const baseDir = path.dirname(__dirname);
const contactsPath = path.join(baseDir,"/models/contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const parseData = await JSON.parse(data);
    return parseData;
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const parseData = await JSON.parse(data);

    const contact = parseData.find(({ id }) => {
      return id === contactId;
    });
    if (contact !== undefined) {
      return contact;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const parseData = await JSON.parse(data);
    let delContact = null;

    const newContacts = parseData.filter((element) => {
      delContact = element.id === contactId ? element : null;
      return element.id !== contactId;
    });

    const controller = new AbortController();
    const { signal } = controller;
    const promise = fs.writeFile(
      contactsPath,
      JSON.stringify(newContacts, null, 2),
      { signal },
    );
    await promise;
    return delContact;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const addContact = async (body) => {
  const newContacts = body;

  try {
    const data = await fs.readFile(contactsPath, "utf8");
    let parseData = await JSON.parse(data);
    parseData = [...parseData, newContacts];

    const controller = new AbortController();
    const { signal } = controller;
    const promise = fs.writeFile(
      contactsPath,
      JSON.stringify(parseData, null, 2),
      { signal },
    );

    await promise;

    return body;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const parsedData = await JSON.parse(data);
    let mergedContact = null;

    const newContacts = parsedData.filter((element) => {
      if (element.id !== contactId) {
        return element;
      } else {
        mergedContact = Object.assign(element, body);
        return mergedContact;
      }
    });

    if (mergedContact !== null) {
      const controller = new AbortController();
      const { signal } = controller;
      const promise = fs.writeFile(
        contactsPath,
        JSON.stringify(newContacts, null, 2),
        { signal },
      );

      await promise;
    }

    return mergedContact;
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
