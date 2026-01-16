// modules/logs/logs.controller.js
const logsService = require("../module/logs/logService");
const { logger } = require("../utils/log");
const customError = require('../errors');
const dailyLog = require("../../worker/model/dailyLog");
const { StatusCodes } = require("http-status-codes");

const createVoiceLog = async (req, res) => {
  const userId = req.userId;
  logger.log('info', `userId ${userId}`)
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
      userId
    });

    return res.status(201).json(log);
  } catch (error) {
    console.error("Create voice log error:", error);
    return res.status(500).json({
      message: "Failed to create voice log",
    });
  }
};

const getList = async (req, res) => {
  const userId = req.userId;
  if(!userId)throw new customError.UnAuthorizedError('Please login again.');
  const list = await dailyLog.findOne({userId, date: "2026-01-16"});
  res.status(StatusCodes.OK).json({success: true,message: 'User list fetch successfully', list})
}

module.exports = { createVoiceLog, getList };
