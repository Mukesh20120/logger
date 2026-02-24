require('dotenv').config();

module.exports = {
    MONGODB_URL: process.env.MONGODB_URL,
    REDIS_URL: process.env.REDIS_URL,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
}