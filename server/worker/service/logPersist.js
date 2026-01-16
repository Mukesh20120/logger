const DailyLog = require("../model/dailyLog");

const saveLogForUser = async ({ userId, text }) => {
  const date = new Date().toISOString().slice(0, 10);

  await DailyLog.findOneAndUpdate(
    { userId, date },
    {
      $push: {
        logs: {
          text,
          source: 'voice',
          createdAt: new Date()
        },
      },
    },
    {
      upsert: true,
      new: true,
    }
  );
};

module.exports = { saveLogForUser };
