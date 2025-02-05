const supertest = require("supertest");

const request = supertest("http://localhost:8080/");

describe("Auth API", () => {
  describe("/auth/signup", () => {
    test("should create new user and return 201", async () => {
      const response = await request.put("auth/signup").send({
        email: "test@example.com",
        name: "Test User",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User created successfully.");
    });

    test("should return error msg if email already exists", async () => {
      const response = await request.put("auth/signup").send({
        email: "test@example.com",
        name: "Test User",
        password: "password123",
      });

      expect(response.status).toBe(422);
      expect(response.body.message).toBe("E-mail address already exists.");
    });

    test("should return error if user empty", async () => {
      const response = await request.put("auth/signup").send({
        email: "test@test.com",
        name: "",
        password: "",
      });

      expect(response.status).toBe(422);
      expect(response.body.message).toBe("Invalid value");
    });
  });

  describe("/auth/login", () => {
    test("should log in a user and return a token", async () => {
      const response = await request.post("auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    test("should return 401 if user is not found", async () => {
      const response = await request.post("auth/login").send({
        email: "notSigned@email.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        "Could not find user with this e-mail.",
      );
    });

    test("should return 401 if password is incorrect", async () => {
      const response = await request.post("auth/login").send({
        email: "test@example.com",
        password: "password321",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Wrong password.");
    });
  });
});
