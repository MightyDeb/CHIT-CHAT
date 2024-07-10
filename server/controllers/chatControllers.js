import { ALERT, NEW_MESSAGE, NEW_MESSAGE_ALERT, REFETCH_CHATS } from "../constants/events.js";
import { emitEvent, uploadFilesToCloudinary } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import {Message} from '../models/message.js'

const newGroupChat= async(req,res,next)=>{
  try {
    const {name,members}= req.body;
    if(!name){
      return next(new ErrorHandler('Please enter group chat name', 400))
    }
    if(!members || members.length<2 || members.length>100){
      return next(new ErrorHandler('Group chat must have atleast three members and atmost 100 members', 400))
    }
    const allMembers=[...members,req.userId]
    await Chat.create({
      name, groupChat: true, creator: req.userId, members: allMembers
    })
    emitEvent(req,ALERT,allMembers,{message:`Welcome to ${name} group`})
    emitEvent(req,REFETCH_CHATS,members)
    return res.status(201).json({
      success: true, message: 'Group created'
    })
  } catch (error) {
    next(error)
  }
}

const getMyChats= async(req,res,next)=>{
  try {
    const chats= await Chat.find({members: req.userId}).populate("members","name avatar")
    const transformedChats= chats.map(({_id,name,groupChat,members})=>{
      const getOtherMember= (members, userId)=>{
        return members.find((member)=> member._id.toString()!== userId.toString())
      }
      const otherMember= getOtherMember(members, req.userId)
      return{
        _id, groupChat,
        avatar: groupChat ? members.slice(0,3).map(({avatar})=> avatar.url) : [otherMember.avatar.url],
        name: groupChat ? name : otherMember.name,
        members: members.reduce((prev,curr)=>{
          if(curr._id.toString() !== req.userId.toString()){
            prev.push(curr._id)
          }
          return prev
        },[])
      }
    })
    return res.status(200).json({
      success: true,
      chats: transformedChats
    })
  } catch (error) {
    next(error)
  }
}

const getMyGroups= async(req,res,next)=>{
  try {
    const chats= await Chat.find({
      members: req.userId, groupChat: true
    }).populate("members","name avatar")
    const groups= chats.map(({_id,groupChat,name,members})=>{
      return{
        _id, groupChat, name,
        avatar: members.slice(0,3).map(({avatar})=> avatar.url)
      }
    })
    return res.status(201).json({
      success: true,
      groups,
    })
  } catch (error) {
    next(error)
  }
}

const addMembers= async(req,res,next)=>{
  try {
    const {chatId, members}= req.body
    if(!chatId){
      return next(new ErrorHandler('Please enter chat_ID', 400))
    }
    if(!members || members.length<1 || members.length>97){
      return next(new ErrorHandler('Please provide appropriate members', 400))
    }
    const chat= await Chat.findById(chatId)
    if(!chat){
      return next(new ErrorHandler("Chat cannot be found", 404))
    }
    if(!chat.groupChat){
      return next(new ErrorHandler("This is not a group chat", 400))
    }
    if(chat.creator.toString() !== req.userId.toString()){
      return next(new ErrorHandler("You are not allowed to add members to the group", 403))
    }
    const allNewMembersPromise = members.map(i=> User.findById(i,"name"))
    const allNewMembers= await Promise.all(allNewMembersPromise)
    const uniqueMembers= allNewMembers.filter(i=> !chat.members.includes(i._id.toString())).map(i=> i._id)
    if(uniqueMembers && uniqueMembers.length> 0 ){
      chat.members.push(...uniqueMembers.map((i)=> i._id))
      if(chat.members.length>100){
        return next(new ErrorHandler('Group members limit reached', 400))
      }
      await chat.save()
      const allUsersName= uniqueMembers.map(i=> i.name).join(",")
      emitEvent(req,ALERT,chat.members,{message:`${allUsersName} have been added in the group`,chatId})
      emitEvent(req,REFETCH_CHATS,chat.members)
    }else{
      return next(new ErrorHandler('No new members were added', 400))
    }
    return res.status(200).json({
      success: true,
      message: 'Members added successfully'
    })
  } catch (error) {
    next(error)
  }
}

const removeMember= async(req,res,next)=>{
  const {userId, chatId}= req.body
  if(!userId || !chatId){
    return next(new ErrorHandler("Please enter all details", 400))
  }
  const [chat,userToRemove]= await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name")
  ])
  if (!chat){
    return next(new ErrorHandler("Chat not found", 404))
  }
  if(!chat.groupChat){
    return next(new ErrorHandler("This is not a group chat", 400))
  }
  if(chat.creator.toString() !== req.userId.toString()){
    return next(new ErrorHandler("You are not allowed to remove members to the group", 403))
  }
  if(chat.members.length <=3){
    return next(new ErrorHandler("Group must have atleast three members", 400))
  }
  const allChatMembers= chat.members.map((i)=> i.toString())
  chat.members= chat.members.filter((member)=> member.toString() !== userId.toString())
  await chat.save()
  emitEvent(
    req,ALERT,chat.members,{message:`${userToRemove.name} has been removed from the group`, chatId}
  )
  emitEvent(req,REFETCH_CHATS,allChatMembers)
  return res.status(200).json({
    success: true,
    message: 'Member removed successfully'
  })
}

const leaveGroup= async(req,res,next)=>{
  if(!req.params.id){
    return next(new ErrorHandler("Please enter chat ID", 400))
  }
  const chatId= req.params.id;

  const chat= await Chat.findById(chatId) 
  if (!chat){
    return next(new ErrorHandler("Chat not found", 404))
  }
  if(!chat.groupChat){
    return next(new ErrorHandler("This is not a group chat", 400))
  }
  const remainingMembers= chat.members.filter((member)=> member.toString() !== req.userId.toString())
  if(remainingMembers && remainingMembers.length<3){
    return next(new ErrorHandler('Group must have atleast three members', 400))
  }
  if(chat.creator.toString() === req.userId.toString()){
    const randomIndex= Math.floor(Math.random()* remainingMembers.length)
    const newCreator= remainingMembers[randomIndex]
    chat.creator= newCreator
  }
  chat.members= remainingMembers
  const user= await User.findById(req.userId, "name")
  await chat.save()
  emitEvent(
    req,ALERT,chat.members,{message:`${user.name} has left the group`, chatId}
  )
  return res.status(200).json({
    success: true,
    message: 'User left successfully'
  })
}

const sendAttachments= async(req,res,next)=>{
  try {
    const {chatId}= req.body
    if(!chatId){
      return next(new ErrorHandler("Please enter chat ID", 400))
    }
    const [chat, me]= await Promise.all([Chat.findById(chatId),User.findById(req.userId, "name")])
    if(!chat){
      return next(new ErrorHandler("Chat not found",404))
    }
    const files= req.files || []
    console.log(files)
    if(!files || files.length<1){
      return next(new ErrorHandler("Please send attachments",400))
    }
    if(files.length>5){
      return next(new ErrorHandler("Files can't be more than five",400))
    }

    const attachments= await uploadFilesToCloudinary(files)
    const messageForRealTime= {
      content: "", attachments, sender: { _id: me._id, name: me.name }, chatId
    }
    const messageForDB= {
      content: "", attachments, sender: req.userId, chatId
    }
    const message= await Message.create(messageForDB)

    emitEvent(req,NEW_MESSAGE,chat.members,{
      message: messageForRealTime, chatId
    })
    emitEvent(req,NEW_MESSAGE_ALERT,chat.members,{chatId})
    return res.status(200).json({
      success: true,
      message
    })
  } catch (error) {
    next(error)
  }
}

const getChatDetails= async(req,res,next)=>{
  try {
    if(!req.params.id){
      return next(new ErrorHandler("Please enter chat ID", 400))
    }
    if(req.query.populate==='true'){
      const chat= await Chat.findById(req.params.id).populate('members','name avatar').lean()
      if(!chat){
        return next(new ErrorHandler("Chat not found",404))
      }
      chat.members= chat.members.map(({_id,name,avatar})=>({
        _id, name, avatar: avatar.url
      }))
      return res.status(200).json({
        success: true, chat,
      })
    }else{
      const chat= await Chat.findById(req.params.id)
      if(!chat){
        return next(new ErrorHandler("Chat not found",404))
      }
      return res.status(200).json({
        success: true, chat,
      })
    }
  } catch (error) {
    next(error)
  }
}

const renameGroup= async(req,res,next)=>{
  try {
    if(!req.params.id){
      return next(new ErrorHandler("Please enter chat ID", 400))
    }
    const chatId= req.params.id
    const {name}= req.body
    if(!name){
      return next(new ErrorHandler("Enter the new group name", 400))
    }
    const chat= await Chat.findById(chatId)
    if(!chat){
      return next(new ErrorHandler('Chat not found', 404))
    }
    if(!chat.groupChat){
      return next(new ErrorHandler('This is not a group chat',400))
    }
    if(chat.creator.toString() !== req.userId.toString()){
      return next(new ErrorHandler('You are not allowed to rename the group',403))
    }
    chat.name= name
    await chat.save()
    emitEvent(req,REFETCH_CHATS, chat.members)
    return res.status(200).json({
      success: true,
      message: 'Group renamed successfully'
    })
  } catch (error) {
    next(error)
  }
}

const deleteChat= async(req,res,next)=>{
  try {
    if(!req.params.id){
      return next(new ErrorHandler("Please enter chat ID", 400))
    }
    const chatId= req.params.id
    const chat= await Chat.findById(chatId)
    if(!chat){
      return next(new ErrorHandler('Chat not found', 404))
    }
    const members= chat.members;
    if(chat.groupChat && chat.creator.toString() !== req.userId.toString()){
      return next(new ErrorHandler('You are not allowed to delete the group', 403))
    }
    if(!chat.groupChat && !chat.members.includes(req.userId.toString())){
      return next(new ErrorHandler('You are not allowed to delete the group', 403))
    }
    const messagesWithAttachments= await Message.find({chat: chatId, attachments: { $exists: true, $ne: []} })
    const public_ids= []
    messagesWithAttachments.forEach(({attachments})=>
      attachments.forEach(({public_id})=>
        public_ids.push(public_id)
      )
    )
    await Promise.all([
      chat.deleteOne(),
      Message.deleteMany({ chatId: chatId })
    ])
    emitEvent(req,REFETCH_CHATS,members)
    return res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

const getMessages= async(req,res,next)=>{
  try {
    if(!req.params.id){
      return next(new ErrorHandler("Please enter chat ID", 400))
    }
    const chatId= req.params.id
    const {page=1}= req.query
    const limit=20
    const skip= (page-1)*limit
    const chat= await Chat.findById(chatId)
    if(!chat){
      return next(new ErrorHandler("Chat not found", 404))
    }
    if(!chat.members.includes(req.userId.toString())){
      return next(new ErrorHandler("You are not allowed to access this chat", 403))
    }
    const [messages,totalMessagesCount]= await Promise.all(
      [Message.find({chatId}).sort({createdAt: -1}).skip(skip).limit(limit).populate("sender","name").lean(), 
        Message.countDocuments({chatId})
      ])
    const totalPages= Math.ceil(totalMessagesCount/limit) || 0
    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
      totalPages
    })
  } catch (error) {
    next(error)
  }
}

const getCommunities= async(req,res,next)=>{
  try {
    const chats= await Chat.find({
      groupChat: true
    }).populate("creator","name avatar isAdmin")
    const filterChats= chats.filter(({creator})=> creator.isAdmin === true)
    const communities= filterChats.map(({_id,name,members,creator})=>{
      return{
        _id, name, creator,
        memberCount: members.length
      }
    })
    return res.status(201).json({
      success: true,
      communities,
    })
  } catch (error) {
    next(error)
  }
}

export {newGroupChat, getMyChats, getMyGroups, addMembers, removeMember, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages, getCommunities}
