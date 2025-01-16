import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/mongoConnect.js";
import { app, server } from "./socket/socket.js";


import { nginxCurrentServer } from "./middlewares/nginxCurrentServer.js";

const __dirname = path.resolve();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use(nginxCurrentServer);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

const port = process.env.PORT || 5000;
const serverId = process.env.SERVER_ID;

server.listen(port, () => {
  connectToMongoDB();
  console.log(
    `${serverId} - server up 🚀 and running on http://localhost:${port}`
  );
});
