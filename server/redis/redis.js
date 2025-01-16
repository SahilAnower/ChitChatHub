import { Redis } from "ioredis";
import { getSocketIdFromUserId, io } from "../socket/socket.js";

const redisInit = () => {
  const redisPublisher = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  });

  const redisSubscriber = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  });

  redisSubscriber.subscribe(`message_channel_${process.env.SERVER_ID}`); // for messages

  redisSubscriber.on("message", (channel, message) => {
    console.log(`Received message from channel ${channel}: ${message}`);

    const newMessage = JSON.parse(message);
    const receiverSocketId = getSocketIdFromUserId(newMessage.receiverId);

    if (receiverSocketId) {
      // online
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
  });

  return { redisPublisher, redisSubscriber };
};

export default redisInit;
