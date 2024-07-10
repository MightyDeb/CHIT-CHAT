import React, { useCallback, useEffect, useRef } from 'react'
import Header from './Header'
import Title from '../shared/Title'
import { Drawer, Grid, Skeleton } from '@mui/material'
import ChatList from '../../specific/ChatList'
import { useNavigate, useParams } from 'react-router-dom'
import Profile from '../../specific/Profile'
import { useMyChatsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsDeleteMenu, setIsMobileMenu, setSelectedDeleteChat } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'
import { useSocketEvents } from '../../hooks/hook'
import { GetSocket } from '../../socket'
import { NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from '../../constants/events'
import { incrementNotifications, setNewMessagesAlert } from '../../redux/reducers/chat'
import { getOrSaveFromStorage } from '../../lib/features'
import DeleteChatDialog from '../dialogs/DeleteChatMenu'

{/* eslint-disable */}
const AppLayout = ()=>(WrappedComponent)=> {
  return(props)=>{
    //utility variables
    const params=useParams()
    const navigate= useNavigate()
    const dispatch= useDispatch()
    const deleteMenuAnchor= useRef(null)
    const socket= GetSocket()

    //extract chatId from params
    const chatId= params.chatId
    
    //state redux values
    const {isMobileMenu}= useSelector((state)=> state.misc)
    const {user}= useSelector((state)=> state.auth)
    const {newMessagesAlert}= useSelector((state)=> state.chat)

    //GET my chats (friends+groups)
    const {isLoading,data,isError,error,refetch}= useMyChatsQuery("")

    //error handling of rtk queries
    const errors= [{isError,error}]
    useEffect(()=>{
      errors.forEach(({isError,error})=>{
        if(isError){
          return ()=> toast.error(error?.data?.message || 'Something went wrong')
        }
      }) 
    },[errors])

    //save and extract no. of new messages in local storage to prevent loss while refreshing
    useEffect(()=>{
      getOrSaveFromStorage({key: NEW_MESSAGE_ALERT, value: newMessagesAlert})
    },[newMessagesAlert])


    const handleDeleteChat=(e,chatId,groupChat)=>{
      dispatch(setIsDeleteMenu(true))
      dispatch(setSelectedDeleteChat({chatId,groupChat}))
      deleteMenuAnchor.current= e.currentTarget 
    }
    const handleMobileClose=()=>{
      dispatch(setIsMobileMenu(false))
    }

    //event listeners for Sokcet Events using useCallback() hook
    const newMessageAlertHandler= useCallback((data)=>{
      if(data.chatId === chatId) 
        return
      dispatch(setNewMessagesAlert(data))
    },[])
    const newRequestHandler= useCallback(()=>{
      dispatch(incrementNotifications())
    },[dispatch])
    const refetchListener= useCallback((data)=>{
      refetch()      //refetch
      navigate("/")
    },[refetch,navigate])
    
    const eventHandlers= { 
      [NEW_MESSAGE_ALERT]: newMessageAlertHandler, [NEW_REQUEST]: newRequestHandler, [REFETCH_CHATS]: refetchListener
    }

    //utilising socket.io events for real time interaction
    useSocketEvents(socket, eventHandlers)
    
    return(
      <div>
        <Title/>
        <Header/>
        <DeleteChatDialog deleteOptionAnchor={deleteMenuAnchor}/>
        {
          isLoading? <Skeleton/> : (
            <Drawer open={isMobileMenu} onClose={handleMobileClose}>
              <ChatList w='70vw' chats={data?.chats} chatId={chatId} newMessagesAlert={newMessagesAlert} handleDeleteChat={handleDeleteChat} />
            </Drawer>
          )
        }
        <Grid container height={"calc(100vh-4rem)"} >
          <Grid item sm={4} md={3} sx={{
            display: {xs:'none',sm:'block'},
            }} height={'90.5vh'} >
              {isLoading ? <Skeleton/> :   
                <ChatList chats={data?.chats} chatId={chatId} newMessagesAlert={newMessagesAlert} handleDeleteChat={handleDeleteChat} />
              }
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6}height={'90.5vh'} >
            <WrappedComponent {...props} chatId={chatId} user={user}/>
          </Grid>
          <Grid item md={4} lg={3} sx={{
            display: {xs:'none',md:'block'},
            padding:'2rem', bgcolor: '#DBC03A', borderLeft: '5px solid black'
          }} height={'90.5vh'} >
            <Profile user={user}/>
          </Grid>
        </Grid>
      </div>
    )
  } 
}
{/* eslint-disable */}

export default AppLayout