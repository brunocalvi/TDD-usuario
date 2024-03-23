const app = require("../src/app");
const supertest = require("supertest");

let request = supertest(app);

test("A aplicação deve responder na porta 3131", async () => {
  await request.get("/").then(res => {
    let status = res.statusCode
    expect(status).toEqual(200);

  }).catch(e => {
    expect(e).toMatch('error');

  });
});