import jwt from "jsonwebtoken"
import { ErrorHandler } from "../utils/utility.js"
import { User } from "../models/user.js"

export const isAuthenticated=(req,res,next)=>{
  try {
    const token= req.cookies["token"]
    if(!token){
      return next(new ErrorHandler('Please login to access the route', 401))
    }
    const decodedData= jwt.verify(token, process.env.JWT_SECRET || 'DENOIRJOI2UJCJOMOI943CKN')
    req.userId= decodedData._id;
    next()
  } catch (error) {
    next(error)
  }
}

export const socketAuthenticator= async (err,socket,next) =>{
    try {
      if(err){
        return next(err)
      }
      const authToken= socket.request.cookies["token"]
      if(!authToken){
        return next(new ErrorHandler("Please login to access this route.", 401))
      }
      const decodedData= jwt.verify(authToken, process.env.JWT_SECRET || 'DENOIRJOI2UJCJOMOI943CKN')
      
      const user= await User.findById(decodedData._id)
      if(!user){
        return next(new ErrorHandler("Please login to access this route.", 401))
      }
      socket.user= user
      return next()
    } catch (error) {
      return next(new ErrorHandler("Please login to access this route.", 401))
    }
}