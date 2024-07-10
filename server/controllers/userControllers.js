import { compare } from 'bcrypt'
import {User} from '../models/user.js'
import { emitEvent, sendToken, uploadFilesToCloudinary } from '../utils/features.js'
import { ErrorHandler } from '../utils/utility.js'
import { Chat } from '../models/chat.js'
import {Request} from '../models/request.js'
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js'

//create a new user, save it to database and save token in cookie
const register= async(req,res,next)=>{
  try {
    const {name,username,password,bio}= req.body
    const file= req.file
    if(!file){
      return next(new ErrorHandler("Please upload avatar"))
    }
    const result= await uploadFilesToCloudinary([file])
    const avatar={
      public_id: result[0].public_id,
      url: result[0].url
    }
    if(!name || !username || !password|| !avatar){
      return next(new ErrorHandler('Fill in all details',400))
    }
    const user= await User.findOne({username})
    if(user){
      return next(new ErrorHandler('Username alreasy exists',400))
    }
    if(password.length < 6){
      return next(new ErrorHandler('Password is atleast of 6 characters',400))
    }
    const newUser= await User.create({
      name,username,password,avatar,bio
    })
    sendToken(res,newUser,201,"User created successfully")
  } catch (error) {
    next(error)
  }
}

//login user and save token in cookie
const login= async(req,res,next)=>{
  try {
    const {username,password}= req.body
    if(!username || !password){
      return next(new ErrorHandler('Fill in all details',400))
    }
    const user= await User.findOne({username}).select("+password")
    if(!user){
      return next(new ErrorHandler('Username does not exist',404))
    }
    const isMatch= await compare(password, user.password)
    if(!isMatch){
      return next(new ErrorHandler('Invalid credentials',404))
    }
    sendToken(res,user,200,`Welcome Back ${user.name}`)
  } catch (error) {
    next(error)
  } 
}

const getMyProfile= async(req,res,next)=>{
  try {
    const user= await User.findById(req.userId)
    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    next(error)
  } 
}

const logout= (req,res,next)=>{
  return res.status(200).cookie("token","",{
    maxAge: 0, sameSite: 'none', httpOnly: true, secure: true}).json({
    success: true,
    message: 'Logged out successfully'
  })
}

const getUserProfile= async(req,res,next)=>{
  try {
    const {userId}= req.params
    if(!userId){
      return next(new ErrorHandler("No User found", 400))
    }
    const user= await User.findById(userId)
    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    next(error)
  } 
}

const searchUser= async(req,res,next)=>{
  try {
    const {name=""}= req.query
    const myChats= await Chat.find({groupChat: false, members: req.userId})
    //me+ friends(people I have chatted with)
    const allUsersFromMyChats= myChats.map(chat=> chat.members).flat()
    allUsersFromMyChats.push(req.userId)
    const allUsersExceptMeAndFriends= await User.find({_id: {$nin: allUsersFromMyChats}, 
      name: {$regex: name, $options: "i"}})
    const users= allUsersExceptMeAndFriends.map(({_id,name,avatar})=> ({_id,name,avatar: avatar.url}))
    return res.status(200).json({
      success: true,
      users
    })
  } catch (error) {
    next(error)
  }
}

const sendFriendRequest= async(req,res,next)=>{
 try {
  const {userId}= req.body
  if(!userId){
    return next(new ErrorHandler('Please enter user ID',400))
  }
  
  const request= await Request.findOne({
    $or: [{sender: req.userId, receiver: userId},{sender: userId, receiver: req.userId}]
  })
  if(request){
    return next(new ErrorHandler('Request already sent',400))
  }
  await Request.create({
    sender: req.userId,
    receiver: userId,
  })
  emitEvent(req,NEW_REQUEST,[userId])
  return res.status(200).json({
    success: true,
    message: "Friend Request Sent"
  })
 } catch (error) {
  next(error)
 }
}

const acceptFriendRequest= async(req,res,next)=>{
  try {
    const {requestId, accept}=req.body
    const request= await Request.findById(requestId).populate("sender","name").populate("receiver","name")
    if(!request){
      return next(new ErrorHandler("Request not found", 404))
    }
    if(request.receiver._id.toString() !== req.userId.toString()){
      return next(new ErrorHandler('You are not authorized to accept this request', 401))
    }
    if(!accept){
      await request.deleteOne()
      return res.status(200).json({
        success: true,
        message: "Friend Request rejected"
      })
    }else{
      const members= [request.sender._id, request.receiver._id]
      await Promise.all([Chat.create({members,
      name: `${request.sender.name}-${request.receiver.name}`}), request.deleteOne()])
      emitEvent(req,REFETCH_CHATS,members)
      return res.status(200).json({
        success: true,
        message: 'Friend Request accepted',
        senderId: request.sender._id,
      })
    }

  } catch (error) {
    next(error)
  }
}

const getMyNotifications= async(req,res,next)=>{
  try {
    const requests= await Request.find({receiver: req.userId}).populate("sender","name avatar")
    const allRequests= requests.map(({_id,sender})=>({
      _id, sender: { _id: sender._id, name: sender.name, avatar: sender.avatar.url }
    }))
    return res.status(200).json({
      success: true,
      allRequests
    })
  } catch (error) {
    next(error)
  }
}

const getMyFriends= async(req,res,next)=>{
  try {
    const chatId= req.query.chatId
    const chats= await Chat.find({members: req.userId, groupChat: false}).populate("members","name avatar")
    const getOtherMember= (members, userId)=>{
      return members.find((member)=> member._id.toString()!== userId.toString())
    }
    const friends= chats.map(({members})=>{
      const otherUser= getOtherMember(members, req.userId)
      if(otherUser){
        return{
           _id: otherUser._id, name: otherUser.name, avatar: otherUser.avatar.url
        }
      } 
    })
    if(chatId){
      const chat= await Chat.findById(chatId)
      const availableFriends= friends.filter((friend)=> !chat.members.includes(friend._id))
      return res.status(200).json({
        success: true,
        friends: availableFriends
      })  
    }else{
      return res.status(200).json({
        success: true,
        friends
      })
    }
  } catch (error) {
    next(error)
  }
}

const updateMyProfile= async(req,res,next)=>{
  try {
    const user= await User.findById(req.userId)
    const {newName,newUsername,newPassword,newBio}= req.body
    
    const newFile= req.file
    let newAvatar={}
    if(newFile){
      const result= await uploadFilesToCloudinary([newFile])
      newAvatar={
        public_id: result[0].public_id,
        url: result[0].url
      }
    }
    const otherUser= await User.findOne({username: newUsername})
    if(otherUser){
      return next(new ErrorHandler('This username already exists', 400))
    }
    if(newName)  user.name= newName
    if(newUsername)  user.username= newUsername
    if(newBio)  user.bio= newBio
    if(newPassword)  user.password= newPassword
    if(newAvatar.public_id)  user.avatar= newAvatar
    await user.save()
    
    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    next(error)
  }
}

export {register,login,getMyProfile,logout, searchUser,sendFriendRequest,acceptFriendRequest,getMyNotifications,getMyFriends,updateMyProfile,getUserProfile}