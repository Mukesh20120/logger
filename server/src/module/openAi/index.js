const fs = require("fs");
const OpenAI = require("openai");
const keys = require("../../config/keys");

const openai = new OpenAI({
    apiKey: keys.OPENAI_API_KEY,
});

const map = new Map();

const transcriptByOpenAi = async ({ path }) => {
    try {
        if (!path) {
            throw new Error("Audio path is missing");
        }

        if (!fs.existsSync(path)) {
            throw new Error(`Audio file not found at path: ${path}`);
        }

        if (map.has(path)) {
            return map.get(path);
        }

        const res = await openai.audio.transcriptions.create({
            file: fs.createReadStream(path),
            model: "gpt-4o-mini-transcribe",
            response_format: "text",
        });
        console.log({ res });
        map.set(res);
        return res; // <-- transcription text
    } catch (error) {
        console.error("OpenAI transcription error:", error);
        throw new Error(`transcriptByOpenAi failed: ${error.message}`);
    }
};

module.exports = { transcriptByOpenAi };
