// middlewares/upload.middleware.js
const multer = require("multer");

const audioUpload = multer({
  storage: multer.memoryStorage(), // keep audio in memory
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = { audioUpload };
