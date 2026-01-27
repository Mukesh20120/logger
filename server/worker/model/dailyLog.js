const mongoose = require('mongoose');

const logItemSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        enum: ['voice', 'manual'],
        default: 'voice'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
},{_id: false});

const dailyLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        date: {
            type: Date,
            required: true,
            index: true
        },
        logs: [logItemSchema]
    },
    {timestamps: true}
)

dailyLogSchema.index({userId: 1, date: 1}, {unique: true});

module.exports = mongoose.model("DailyLog", dailyLogSchema);