const {Redis} = require('ioredis');

const connection = new Redis({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null
});

connection.on('connect', ()=>{
    console.log('Connect redis successfully.');
})
connection.on('error', (err)=>{
    console.log('something went wrong redis conneciton', err);
})

module.exports = {connection};