const axios = require("axios");
// const users = require("./../controllers/database/users");
const app = require("./../../app");
const { isString } = require("lodash");
const { defaults } = require("joi");

// let token = null;

describe("webservice - login/signin", () => {
  const PORT = process.env.PORT || 3000;
  let server;

  beforeEach(() => {
    server = app.listen(PORT);
  });

  afterEach(() => {
    server.close();
  });

  it("POST login", async () => {
    const resp = await axios.post(`http://localhost:${PORT}/users/login`, {
      "email": "arkadiusz3@gmail.pl",
      "password": "gmail",
    });
    const status = resp.data.code;
    token = resp.data.token;
    // const user = resp.data.user;
    const email = resp.data.user.email;
    const subscription = resp.data.user.subscription;

    expect(status).toEqual(200);
    expect(token).not.toBeNull();
    expect(isString(email)).toBeTruthy();
    expect(isString(subscription)).toBeTruthy();
  });

  it("POST signup", async () => {
      const resp = await axios.post(`http://localhost:${PORT}/users/signup`, {
        "email": `test${Math.random()}@gmail.pl`,
        "password": "zzzzz",
      }, {
        // headers: {
        //   "authorization": `${ token }`,
        // },
      });
      console.log('resp: ', resp.data);
      const status = resp.data.code;
      const token = resp.data.data.user.token;
      // const user = resp.data.user;
      const email = resp.data.data.user.email;
      const subscription = resp.data.data.user.subscription;

      expect(status).toEqual(201);
      expect(token).toBeNull();
      expect(isString(email)).toBeTruthy();
      expect(isString(subscription)).toBeTruthy();
  });
});
