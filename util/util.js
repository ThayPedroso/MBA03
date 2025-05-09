const fs = require("fs");
const path = require("path");

exports.clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(`Error to delete image: ${err}`);
    }
  });
};
