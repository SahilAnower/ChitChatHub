# ChitChatHub

ChitChatHub is a real-time chat application designed to facilitate seamless communication between users. Built with the MERN (MongoDB, Express.js, React.js, Node.js) stack, it offers features such as instant messaging, voice and video calling, and user presence indicators.

## Features

- **Real-Time Messaging**: Engage in instant text-based conversations with other users.
- **Voice and Video Calling**: Initiate peer-to-peer voice and video calls using WebRTC technology.
- **User Presence Indicators**: View users' online status and last active times.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-Time Communication**: Socket.IO, WebRTC

## Installation

To run ChitChatHub locally, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/SahilAnower/ChitChatHub.git
cd ChitChatHub
```

### 2. Backend setup

- `cd server`
- `npm i`
- Create a .env file with following variables:
  ```bash
    JWT_SECRET=
    MONGO_URI=
    NODE_ENV=development/production
    PORT=
  ```
- `npm run dev` - to start the server
