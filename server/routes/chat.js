import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import { newGroupChat, getMyChats, getMyGroups, addMembers, removeMember, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages, getCommunities } from "../controllers/chatControllers.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const app= express.Router()

//user must be logged in to access the below routes
app.use(isAuthenticated)

app.post('/new', newGroupChat)
app.get('/my', getMyChats)
app.get('/my/groups',getMyGroups )
app.put('/addmembers', addMembers)
app.put('/removemember', removeMember)
app.delete('/leave/:id', leaveGroup)
app.post('/message', attachmentsMulter, sendAttachments)
app.get("/community", getCommunities)
app.get("/message/:id", getMessages)
app.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat)


export default app;