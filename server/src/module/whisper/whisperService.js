const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");

const TEMP_DIR = path.join(__dirname, "../../temp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

const transcribeWithWhisper = (audioBuffer, mimeType) => {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const ext = mimeType.includes("wav") ? "wav" : "m4a";

    const audioPath = path.join(TEMP_DIR, `${id}.${ext}`);
    const txtPath = path.join(TEMP_DIR, `${id}.txt`);

    fs.writeFileSync(audioPath, audioBuffer);

    const command = `whisper "${audioPath}" --model tiny --language en --output_dir "${TEMP_DIR}" --output_format txt`;

    exec(command, (error) => {
      if (error) {
        cleanup();
        return reject(error);
      }

      // ⏳ wait briefly to ensure file exists
      setTimeout(() => {
        try {
          const text = fs.readFileSync(txtPath, "utf-8").trim();
          cleanup();
          resolve(text);
        } catch (err) {
          cleanup();
          reject(err);
        }
      }, 200);
    });

    function cleanup() {
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
      if (fs.existsSync(txtPath)) fs.unlinkSync(txtPath);
    }
  });
};

module.exports = { transcribeWithWhisper };
