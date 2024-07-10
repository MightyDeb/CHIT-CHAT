import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import {v2 as cloudinary} from 'cloudinary'
import {v4 as uuid} from 'uuid'
import { getBase64, getSockets } from "../lib/helper.js";

dotenv.config({
  path: './.env'
})

const connectDB= (uri)=> mongoose.connect(uri,{
  dbName: 'Chat_App'
}).then((data)=>{
  console.log(`Connected to DB: ${data.connection.host}`)
}).catch(err=> { throw err })

const sendToken= (res,user,code,message)=>{
  const token= jwt.sign({_id: user._id}, process.env.JWT_SECRET || 'DENOIRJOI2UJCJOMOI943CKN')
  return res.status(code).cookie("token",token,{
    maxAge: 15*24*60*60*1000, sameSite: 'none', httpOnly: true, secure: true
  }).json({
    success: true, user, message
  })
}

const emitEvent = (req,event,users,data)=>{
  let io= req.app.get("io")
  const usersSocket= getSockets(users)
  io.to(usersSocket).emit(event,data)
}

const uploadFilesToCloudinary= async (files=[])=>{
  const uploadPromises= files.map((file)=>{
    return new Promise((resolve,reject)=>{
      cloudinary.uploader.upload(getBase64(file)
        ,{
        resource_type: "auto",
        public_id: uuid()
      }, (error,result)=>{
        if(error) return reject(error)
        resolve(result)  
      })
    })
  })
  try {
    const results= await Promise.all(uploadPromises)
    const formattedResult= results.map((result)=>({
      public_id: result.public_id,
      url: result.secure_url
    }))
    return formattedResult
  } catch (error) {
    throw new Error("Error uploading files to cloudinary", error)
  }
}


export {connectDB, sendToken, emitEvent, uploadFilesToCloudinary}