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
  if (!userId) {
    throw new customError.UnAuthorizedError('Please login again.');
  }

  const { days, date, from, to } = req.query;
  let query = { userId };

  if (date) {
    query.date = new Date(date);
  } else if (days) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));
    query.date = { $gte: startDate };
  } else if (from && to) {
    query.date = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

  const list = await dailyLog.find(query).sort({ date: -1 });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Logs fetched successfully',
    days: list.length,
    list,
  });
};

const editLog = async (req, res) => {
  const userId = req.userId;
  const { dailyLogId, logId } = req.params;
  const { text, source } = req.body;

  if (!text && !source) {
    return res.status(400).json({
      message: "Nothing to update",
    });
  }

  const updateFields = {};
  if (text) updateFields["logs.$.text"] = text;
  if (source) updateFields["logs.$.source"] = source;

  const updatedLog = await dailyLog.findOneAndUpdate(
    {
      _id: dailyLogId,
      userId,
      "logs._id": logId,
    },
    {
      $set: updateFields,
    },
    {
      new: true,
    }
  );

  if (!updatedLog) {
    return res.status(404).json({
      message: "Log not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Log updated successfully",
    data: updatedLog,
  });
};

const deleteLog = async (req, res) => {
  const userId = req.userId;
  const { dailyLogId, logId } = req.params;

  const deletedLog = await dailyLog.findOneAndUpdate(
    {
      _id: dailyLogId,
      userId,
    },
    {
      $pull: {
        logs: { _id: logId },
      },
    },
    {
      new: true,
    }
  );

  if (!deletedLog) {
    return res.status(404).json({
      message: "Log not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Log deleted successfully",
    data: deletedLog,
  });
};


module.exports = { createVoiceLog, getList, editLog, deleteLog };
