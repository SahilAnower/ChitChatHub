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

export const getSocketIdFromUserId = (userId) => {
  return userSocketMap[userId];
};

export const getSocketFromSocketId = (socketId) => {
  return socketIdToSocketMap[socketId];
};

const userSocketMap = {}; // {userId: socketId}
const socketIdToSocketMap = {}; // {socketId: socket}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId != undefined) {
    userSocketMap[userId] = socket.id;
  }

  if (socket && socket.id) {
    socketIdToSocketMap[socket.id] = socket;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // get online users from the map

  socket.on("typing", (data) => {
    // console.log("Inside typing socket server");
    // console.log(data);
    if (!data) {
      return;
    }
    const { recieverId } = data;
    const recieverSocketId = getSocketIdFromUserId(recieverId);
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
    const recieverSocketId = getSocketIdFromUserId(recieverId);
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
    const recieverSocketId = getSocketIdFromUserId(recieverId);
    if (!recieverSocketId) {
      return;
    }
    io.to(recieverSocketId).emit("videoJoinRequest", {
      senderId: userId,
    });
  });

  socket.on("videoConnect", (data) => {
    const { senderId, recieverId, roomId } = data;
    const senderSocketId = getSocketIdFromUserId(senderId);
    const recieverSocketId = getSocketIdFromUserId(recieverId);
    io.to(senderSocketId).emit("roomJoined", {
      remoteSocketId: recieverSocketId,
      roomId,
    });
    io.to(recieverSocketId).emit("roomJoined", {
      remoteSocketId: senderSocketId,
      roomId,
    });
  });

  socket.on("videoCancel", (data) => {
    const { recieverId } = data;
    const recieverSocketId = getSocketIdFromUserId(recieverId);
    if (!recieverSocketId) {
      return;
    }
    io.to(recieverSocketId).emit("videoCancel", {
      senderId: userId,
    });
  });

  socket.on("user:call", ({ to, offer }) => {
    console.log({ to, offer });
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    console.log({ to, ans });
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    console.log({ to, offer });
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log({ to, ans });
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
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
