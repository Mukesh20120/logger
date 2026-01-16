// modules/logs/logs.routes.js
const express = require("express");
const { audioUpload } = require("../middleware/uploadMiddleware");
const { createVoiceLog, getList } = require("../controller/logController");

const router = express.Router();

router.post(
  "/voice",
  audioUpload.single("audio"), // 👈 key must be "audio"
  createVoiceLog
);

router.get('/list',getList);

module.exports = router;
