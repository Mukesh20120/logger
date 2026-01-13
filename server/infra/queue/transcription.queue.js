const {Queue} = require('bullmq');
const {connection} = require('../redis/redis');

const TRANSCIPT_QUEUE = 'voice-transcript';

const transcriptQueue = new Queue(TRANSCIPT_QUEUE, {
connection
});

module.exports = {
    TRANSCIPT_QUEUE,
    transcriptQueue
}
