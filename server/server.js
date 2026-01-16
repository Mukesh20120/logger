const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {logger} = require('./src/utils/log')
// const {requestLogger} = require('./src/middleware/requestLogger')

const keys = require('./src/config/keys');

const app = express();

const errorHandlerMiddleware = require('./src/middleware/error-handler');
const { authMiddleware } = require('./src/middleware/authMiddleware');
const notFoundMiddleware = require('./src/middleware/not-found');

const connectDB = require('./src/db/connect');

const authRouter = require('./src/router/authRouter');
const logRouter = require('./src/router/logRouter');

// middleware
app.use(
  cors({
    origin: "http://localhost:5173", // 👈 Vite dev server
    credentials: true,               // 👈 ALLOW COOKIES
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());
// app.use(requestLogger);

app.get('/', (req,res)=>{
  logger.info('Server is working fine. :)')
    res.send("server is working...");
})
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/log',authMiddleware,logRouter);

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