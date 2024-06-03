import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId != undefined) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // get online users from the map

  socket.on("typing", (data) => {
    // console.log("Inside typing socket server");
    // console.log(data);
    if (!data) {
      return;
    }
    const { recieverId } = data;
    const recieverSocketId = getReceiverSocketId(recieverId);
    if (!recieverSocketId) {
      return;
    }
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("typing", {
        senderId: userId,
      });
    }
  });

  socket.on("typingEnd", (data) => {
    // console.log("Inside typing end socket server");
    // console.log(data);
    if (!data) {
      return;
    }
    const { recieverId } = data;
    const recieverSocketId = getReceiverSocketId(recieverId);
    if (!recieverSocketId) {
      return;
    }
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("typingEnd", {
        senderId: userId,
      });
    }
  });

  // for video-calling facility

  socket.on("videoJoin", (data) => {
    const { recieverId } = data;
    const recieverSocketId = getReceiverSocketId(recieverId);
    if (!recieverSocketId) {
      return;
    }
    io.to(recieverSocketId).emit("videoJoinRequest", {
      senderId: userId,
    });
  });

  socket.on("videoCancel", (data) => {
    const { recieverId } = data;
    const recieverSocketId = getReceiverSocketId(recieverId);
    if (!recieverSocketId) {
      return;
    }
    io.to(recieverSocketId).emit("videoCancel", {
      senderId: userId,
    });
  });

  socket.on("disconnect", async () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    // save last seen time of this userId
    await User.findByIdAndUpdate(userId, {
      lastSeen: new Date(),
    });
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
