import '../env.js';
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://socketchat-3qjd.onrender.com",
  "https://socketchat-lnrb.onrender.com"
];

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`[SOCKET] CORS rejected: ${origin}`);
        callback(null, false);
      }
    }
  },
});
//fixed the CORS error by adding the origin as a string
//userid <-> socketId (because each id is unique for a user)
const userSocketmap = {}
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    return;
  }
  userSocketmap[userId] = socket.id;



  io.emit("onlineUsers", Object.keys(userSocketmap))
  socket.on("disconnect", () => {

    delete userSocketmap[userId];
    io.emit("onlineUsers", Object.keys(userSocketmap))
  });
});

const getSocketId = (userId) => {
  return userSocketmap[userId];
}

export { io, app, server, getSocketId };
