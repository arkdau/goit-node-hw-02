const fs = require("node:fs/promises");
const path = require("path");

// const baseDir = path.dirname("./models/contacts.json");
// const outFileName = path.basename("/");
// const contactsPath = path.join(baseDir, outFileName);
const contactsPath = "./models/contacts.json";

const listContacts = async () => {
  try {
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
      // console.log("the specified id value does not exist");
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
      if (element.id !== contactId) {
        return element;
      } else {
        delContact = element;
      }
    });

    // console.table(newContacts);

    // _writeFile(
    //   contactsPath,
    //   newContacts,
    // );

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
  // const newContacts = {
  //   "id": `${nanoid()}`,
  //   "name": name,
  //   "email": email,
  //   "phone": phone,
  // };
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    let parseData = await JSON.parse(data);
    parseData = [...parseData, newContacts];

    // console.table(parseData);

    const controller = new AbortController();
    const { signal } = controller;
    const promise = fs.writeFile(
      contactsPath,
      JSON.stringify(parseData, null, 2),
      { signal },
    );

    await promise;

    return body;
    // _writeFile(
    //   contactsPath,
    //   parseData,
    // );
  } catch (err) {
    console.error(err);
    return null;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const parseData = await JSON.parse(data);
    let mergedContact = null;

    const newContacts = parseData.filter((element) => {
      if (element.id !== contactId) {
        return element;
      } else {
        mergedContact = Object.assign(element, body);
        return mergedContact;
      }
    });

    // parseData = [...parseData, newContacts];

    // console.table(parseData);
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

    // _writeFile(
    //   contactsPath,
    //   parseData,
    // );
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
