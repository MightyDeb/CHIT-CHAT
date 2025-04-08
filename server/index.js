import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import {createServer} from "http"
import { v4 as uuid } from "uuid";
import cors from 'cors'
import {v2 as cloudinary} from 'cloudinary'
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING } from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import { socketAuthenticator } from "./middlewares/auth.js";

import userRoutes from './routes/user.js'
import chatRoutes from './routes/chat.js'

dotenv.config({
  path: './.env'
})
connectDB(process.env.MONGO_URI)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'die1jmcfj',
  api_key: process.env.CLOUDINARY_API_KEY || '561936756974929',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Zze7a9l6RVswcCyssjhy7z4-Kbo'
})

const PORT= process.env.PORT || 5000
const userSocketIDs= new Map()

const app= express()
const server= createServer(app)
const io= new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ['GET','POST','PUT','DELETE']
  }
})
app.set("io", io)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}
))

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/chat', chatRoutes)

app.get('/', (req,res)=>{
  res.send('Hello World')
})

io.use((socket, next)=>{
  cookieParser()(socket.request, socket.request.res, async (err)=>{
    await socketAuthenticator(err,socket,next)
  })
})

io.on("connection", (socket)=>{
  const user= socket.user
  userSocketIDs.set(user._id.toString(), socket.id)
  console.log(userSocketIDs)
  socket.on(NEW_MESSAGE, async({chatId,members,message})=>{
    const messageForRealTime={
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name
      },
      chat: chatId,
      createdAt: new Date().toISOString()
    }
    const messageForDB={
      content: message,
      sender: user._id,
      chatId: chatId,
    }
    
    const membersSocket = getSockets(members)
    io.to(membersSocket).emit(NEW_MESSAGE,{
      chatId, message: messageForRealTime
    })
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT,{chatId})
    
    try {
      await Message.create(messageForDB)
    } catch (error) {
      console.log(error)
    }
    
  })
  socket.on(START_TYPING, ({members,chatId})=>{
    const membersSocket= getSockets(members)
    socket.to(membersSocket).emit(START_TYPING, {chatId})
  })
  socket.on(STOP_TYPING, ({members,chatId})=>{
    const membersSocket= getSockets(members)
    socket.to(membersSocket).emit(STOP_TYPING, {chatId})
  })
  socket.on("disconnect", ()=>{
    console.log("user disconnected")
    userSocketIDs.delete(user._id.toString())
  })
})

//errorMiddleware always at last
app.use(errorMiddleware)

server.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)
})

export {userSocketIDs}

