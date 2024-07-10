import jwt from "jsonwebtoken"
import { ErrorHandler } from "../utils/utility.js"

export const adminOnly=(req,res,next)=>{
  try {
    const token= req.cookies["Admin_Token"]
    if(!token){
      return next(new ErrorHandler('Only admin can access the route', 401))
    }
    const secretKey= jwt.verify(token, process.env.JWT_SECRET || 'DENOIRJOI2UJCJOMOI943CKN')
    const adminSecretKey= process.env.ADMIN_SECRET_KEY || "DEBAPRIYA_MAITY"
    const isMatch = secretKey === adminSecretKey
    if(!isMatch){
      return next(new ErrorHandler("Only admin can access the route", 401))
    }
    next()
  } catch (error) {
    next(error)
  }
}