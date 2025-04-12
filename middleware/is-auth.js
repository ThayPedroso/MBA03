require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.", {
      cause: 401,
    });
    throw error;
  }
  const token = req.get("Authorization").split(" ")[1].trim();
  if (token === "undefined") {
    const error = new Error("Not authorized.", {
      cause: 403,
    });
    throw error;
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated.", {
      cause: 401,
    });
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
