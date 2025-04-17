const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const serverRoutes = require("./routes/server");
const util = require("./util/util");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/v1/feed", feedRoutes);
app.use("/v1/auth", authRoutes);
app.use("/server", serverRoutes);

app.use((error, req, res, next) => {
  if (req.method === "PUT" && req.file !== undefined) {
    util.clearImage(req.file.path);
  }
  const status = error.cause || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(
    `mongodb+srv://thaylapedroso88:${process.env.MONGO_DB_PASSWORD}@mongodb.8g4dc.mongodb.net/?retryWrites=true&w=majority&appName=mongoDB`,
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
