const {Redis} = require('ioredis');
const keys = require('../../src/config/keys')

const connection = new Redis(keys.REDIS_URL,{maxRetriesPerRequest: null});

connection.on('connect', ()=>{
    console.log('Connect redis successfully.');
})
connection.on('error', (err)=>{
    console.log('something went wrong redis conneciton', err);
})

module.exports = {connection};