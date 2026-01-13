const fs = require("fs");
const path = require("path");
const { Worker } = require("bullmq");
const {TRANSCIPT_QUEUE} = require('../infra/queue/transcription.queue');
const {connection} = require('../infra/redis/redis');
const { transcribeWithWhisper } = require("../src/module/whisper/whisperService");

console.log("🧠 Transcription worker started");

const worker = new Worker(
  TRANSCIPT_QUEUE,
  async (job) => {
    const { audioPath, id } = job.data;

    console.log(`🎧 Processing job ${id}`);

    try {
      const audioBuffer = fs.readFileSync(audioPath);
      const text = await transcribeWithWhisper(audioBuffer, "audio/m4a");

      console.log(`📝 Transcription (${id}):`, text);

      // 🔮 Later:
      // update DB record here

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
