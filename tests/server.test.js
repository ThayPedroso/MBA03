const supertest = require("supertest");

const request = supertest("http://localhost:8080/");

test("Should respond in port 8080", () => {
  return request.get("server/").then((res) => expect(res.status).toBe(200));
});
