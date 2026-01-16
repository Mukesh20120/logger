const express = require('express');
const cors = require('cors');
const {logger} = require('../src/utils/log')

const keys = require('../src/config/keys');

const app = express();
const connectDB = require('../src/db/connect');

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>{
  logger.info('Server is working fine. :)')
    res.send("server is working...");
})
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/log',authMiddleware,logRouter);

const start = async () => {
  try {
    if(keys.MONGODB_URL){
      await connectDB(keys.MONGODB_URL);
      console.log('connected to DB.')
    }
    app.listen(keys.PORT, () =>
      console.log(`Server is listening on port ${keys.PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();


