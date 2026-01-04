const { transcribeWithWhisper } = require("../whisper/whisperService");

const createFromVoice = async ({ audioBuffer, mimeType }) => {
  console.log("🎤 Received audio:", {
    size: audioBuffer.length,
    mimeType,
  });

  // 🚀 BACKGROUND TASK (DO NOT AWAIT)
  transcribeWithWhisper(audioBuffer, mimeType)
    .then((text) => {
      console.log("📝 Background transcription:", text);

      // 🔮 later:
      // save to DB
    })
    .catch((err) => {
      console.error("❌ Whisper failed:", err);
    });

  // ⚡ respond immediately
  return {
    message: "Voice log accepted",
    timestamp: new Date(),
  };
};

module.exports = { createFromVoice };
