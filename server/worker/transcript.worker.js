const fs = require("fs");
const path = require("path");
const { Worker } = require("bullmq");
const {TRANSCIPT_QUEUE} = require('../infra/queue/transcription.queue');
const {connection} = require('../infra/redis/redis');
const { transcribeWithWhisper } = require("../src/module/whisper/whisperService");
const keys = require("../src/config/keys");
const { saveLogForUser } = require("./service/logPersist");
const connectDB = require("../src/db/connect");

console.log("🧠 Transcription worker started");

const worker = new Worker(
  TRANSCIPT_QUEUE,
  async (job) => {
    const { audioPath, id, userId } = job.data;

    console.log(`🎧 Processing job ${id}`);

    try {
      const audioBuffer = fs.readFileSync(audioPath);
      const text = await transcribeWithWhisper(audioBuffer, "audio/m4a");

      console.log(`📝 Transcription (${id}):`, text, userId);
      
      await saveLogForUser({userId, text});

      fs.unlinkSync(audioPath);

      return { text };
    } catch (err) {
      console.error(`❌ Job failed (${id})`, err);
      throw err;
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job failed: ${job.id}`, err);
});

const start = async () => {
  try {
    if(keys.MONGODB_URL){
      await connectDB(keys.MONGODB_URL);
      console.log('connected to DB.')
    }
  } catch (error) {
    console.log(error);
  }
};

start();
