# 💬 Chit Chat - MERN Real-Time Chat Application

Chit Chat is a full-featured, real-time chat application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) with **JWT-based authentication**, **websockets** (Socket.IO), and **Cloudinary media management**. It supports 1-on-1 and group conversations, friend requests, typing indicators, and user presence tracking.

<div align="center">
  <img src="https://img.shields.io/badge/Backend-Node.js-green" />
  <img src="https://img.shields.io/badge/Frontend-React-blue" />
  <img src="https://img.shields.io/badge/Database-MongoDB-success" />
  <img src="https://img.shields.io/badge/WebSocket-Socket.IO-lightgrey" />
</div>

---

## Introduction
Chit Chat is a modern, real-time chat application built on the powerful MERN (MongoDB, Express.js, React.js, Node.js) stack, designed to offer seamless communication and an engaging social experience using retro-themed NES.CSS. The app features secure JWT-based authentication, enabling users to sign up and log in safely while managing their accounts and chat history. It supports both 1-on-1 direct messages and group conversations, complete with typing indicators, message timestamps, and online presence tracking, all powered through Socket.IO for real-time interaction. Users can connect via friend requests, and only verified profiles can initiate conversations, ensuring a secure and spam-free environment. The app integrates Cloudinary to handle media uploads like images and files within chats, enhancing the user experience with rich content sharing. With Redux Toolkit managing the global state, Chit Chat ensures smooth UI performance and real-time data consistency across all components. Designed with a responsive, clean UI, Chit Chat is optimized for both desktop and mobile devices, making it a scalable solution for personal or professional messaging needs.

## 🚀 Features

- 🔐 **Authentication**
  - JWT-based secure login & signup
  - Email or username-based authentication
- 💬 **Live Chat**
  - 1v1 direct messaging
  - Group chats with participants list
  - Read receipts and message timestamps
- 🧑‍🤝‍🧑 **Friend Requests**
  - Send, accept, and reject friend requests
  - Friend list management
- 🟢 **Real-Time Presence**
  - Online status tracking
  - Typing indicators
- 🖼️ **Media Uploads**
  - Upload images and files via Cloudinary
  - Image previews in chat
- 🌐 **WebSockets (Socket.IO)**
  - Real-time message delivery and user status updates
- 📦 **Redux Integration**
  - Global state management for chats, users, and UI
- ✅ **Profile Verification**
  - Verified badges for trusted users
- 📱 **Responsive UI**
  - Clean and modern responsive design for all screen sizes

---

## 🛠️ Tech Stack

| Category       | Tech Stack                          |
|----------------|--------------------------------------|
| Frontend       | React, Redux Toolkit, Tailwind CSS   |
| Backend        | Node.js, Express.js                  |
| Database       | MongoDB + Mongoose                   |
| Authentication | JWT                                  |
| Real-time Comm | Socket.IO                            |
| Media Storage  | Cloudinary                           |
| State Management | Redux Toolkit                      |

---


## 🔧 Installation & Setup

### Prerequisites
- Node.js and npm
- MongoDB
- Cloudinary account

### Backend

```bash
cd server
npm install
# Add .env file with the following variables:
# PORT=
# MONGODB_URI=
# JWT_SECRET=
# CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=
npm run dev
