const DailyLog = require("../model/dailyLog");

const saveLogForUser = async ({ userId, text }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await DailyLog.findOneAndUpdate(
    { userId, date: today },
    {
      $setOnInsert: {
        userId,
        date: today,
      },
      $push: {
        logs: {
          text,
          source: 'voice',
          createdAt: new Date(),
        },
      },
    },
    {
      upsert: true,
    }
  );
};

module.exports = { saveLogForUser };
