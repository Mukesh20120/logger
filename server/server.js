const express = require('express');
const cors = require('cors');

const keys = require('./src/config/keys');

const app = express();

const errorHandlerMiddleware = require('./src/middleware/error-handler');
const notFoundMiddleware = require('./src/middleware/not-found');
const connectDB = require('./src/db/connect');

const authRouter = require('./src/router/authRouter');
const logRouter = require('./src/router/logRouter')

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>{
    res.send("server is working...");
})
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/log',logRouter);

// error handler middleaware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


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