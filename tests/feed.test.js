const path = require("path");
const supertest = require("supertest");

const request = supertest("http://localhost:8080/");

describe("Feed API", () => {
  let bearerToken;
  let bearerTokenAnotherUser;
  let postId = "67a8e0f5a3e68d56661436e8";
  beforeAll(async () => {
    const response = await request.post("auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    bearerToken = response.body.token;

    const responseAnotherUser = await request.post("auth/login").send({
      email: "anotheruser@example.com",
      password: "password123",
    });
    bearerTokenAnotherUser = responseAnotherUser.body.token;

    const responseEmptyBearer = await request.post("auth/login").send({
      email: "aanotheruser@example.com",
      password: "password123",
    });
    bearerTokenEmpty = responseEmptyBearer.body.token;
  });

  describe("GET: /feed/posts", () => {
    test("should fetch all posts", async () => {
      const response = await request
        .get("feed/posts")
        .set("Authorization", `Bearer ${bearerToken}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Posts fetched successfully.");
    });
  });

  describe("POST: /feed/post", () => {
    test("should create a new post", async () => {
      const response = await request
        .post("feed/post")
        .set("Authorization", `Bearer ${bearerToken}`)
        .field("title", "Test Post")
        .field("content", "This is a test post.")
        .attach("image", path.resolve(__dirname, "..", "images", "duck.jpg"));
      postId = response.body.post._id;
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Post created successfully!");
    });
  });

  describe("GET: /feed/post/postId", () => {
    test("should fetch all posts", async () => {
      const response = await request
        .get(`feed/post/${postId}`)
        .set("Authorization", `Bearer ${bearerToken}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Post fetched successfully.");
    });
  });

  describe("PUT: /feed/post/postId", () => {
    test("should update a post", async () => {
      const response = await request
        .put(`feed/post/${postId}`)
        .set("Authorization", `Bearer ${bearerToken}`)
        .field("title", "New test post title")
        .field("content", "This is a test post modified.")
        .attach("image", path.resolve(__dirname, "..", "images", "cat.jpg"));

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Post updated successfully.");
    });

    test("should only update post using creator auth", async () => {
      const response = await request
        .put(`feed/post/${postId}`)
        .set("Authorization", `Bearer ${bearerTokenAnotherUser}`)
        .field("title", "New test post title")
        .field("content", "This is a test post modified.")
        .attach("image", path.resolve(__dirname, "..", "images", "cat.jpg"));

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Not authorized.");
    });

    test("should not update a post without defined bearer", async () => {
      const response = await request
        .put(`feed/post/${postId}`)
        .set("Authorization", `Bearer ${bearerTokenEmpty}`)
        .field("title", "New test post title")
        .field("content", "This is a test post modified.")
        .attach("image", path.resolve(__dirname, "..", "images", "cat.jpg"));

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Not authorized.");
    });

    test("should generate error if post is not found", async () => {
      const response = await request
        .put(`feed/post/${"67a9035c05ad81ec32282e68"}`)
        .set("Authorization", `Bearer ${bearerToken}`)
        .field("title", "New test post title")
        .field("content", "This is a test post modified.")
        .attach("image", path.resolve(__dirname, "..", "images", "duck.jpg"));

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Unable to find post.");
    });
  });

  describe("DELETE: /feed/post/postId", () => {
    test("should delete a post", async () => {
      const response = await request
        .delete(`feed/post/${postId}`)
        .set("Authorization", `Bearer ${bearerToken}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Post was deleted.");
    });
  });
});
