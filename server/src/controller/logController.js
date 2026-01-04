// modules/logs/logs.controller.js
const logsService = require("../module/logs/logService");

const createVoiceLog = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Audio file is required",
      });
    }

    const audioBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    const log = await logsService.createFromVoice({
      audioBuffer,
      mimeType,
    });

    return res.status(201).json(log);
  } catch (error) {
    console.error("Create voice log error:", error);
    return res.status(500).json({
      message: "Failed to create voice log",
    });
  }
};

module.exports = { createVoiceLog };
