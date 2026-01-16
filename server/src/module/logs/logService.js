const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const {transcriptQueue, TRANSCIPT_QUEUE} = require('../../../infra/queue/transcription.queue')
const {logger} = require('../../utils/log')

const TEMP_DIR = path.join(__dirname, "../../temp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

const createFromVoice = async ({ audioBuffer, mimeType, userId }) => {

    const id = uuidv4();
    const ext = mimeType.includes("wav") ? "wav" : "m4a";
    const audioPath = path.join(TEMP_DIR, `${id}.${ext}`);

   fs.writeFileSync(audioPath, audioBuffer);

   transcriptQueue.add(TRANSCIPT_QUEUE, {
    audioPath,
    mimeType,
    id,
    userId
   })

   logger.log('info', `Job Queue id:${id}`);
    
  return {
    message: "Voice log accepted",
    jobId: id,
    status: "PROCESSING",
    timestamp: new Date(),
  };
};

module.exports = { createFromVoice };
