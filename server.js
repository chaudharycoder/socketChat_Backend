import './env.js'
import { server, app } from './socket/socket.js';
import cookieParser from 'cookie-parser';
import express from 'express';
import { connectDB } from './db/connection1DB.js';
import cors from 'cors'
import userRoute from './routes/userRoute.js'
import messageRoute from './routes/messageRoute.js'
import { errorMiddleware } from './Middlewares/errorMiddleware.js';
connectDB();

const port = process.env.PORT || 5000;
//middleware







const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://socketchatfrontend01.vercel.app"
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Origin rejected: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true
  }));
  






app.use(express.json())
app.use(cookieParser())

// Simple logger to see incoming requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

//route call
app.use('/api/v1/user', userRoute);
app.use('/api/v1/message', messageRoute);
app.use(errorMiddleware)
//call listen
server.listen(port, () => {
    console.log(`your server listening at port ${port}`);
})