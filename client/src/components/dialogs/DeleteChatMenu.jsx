import { Menu, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/reducers/misc'
import { Delete, ExitToApp } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAsyncMutation } from '../../hooks/hook'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api'

//DIALOG THAT UNFRIENDS USER OR LEAVES GROUP 

const DeleteChatDialog = ({deleteOptionAnchor}) => {
  //utility variables 
  const dispatch= useDispatch()
  const navigate= useNavigate()
  //accessing redux state
  const {isDeleteMenu,selectedDeleteChat}= useSelector(state=> state.misc)
  //rtk queries (_ for ignoring return values)
  const [deleteChat, _,deleteChatData]= useAsyncMutation(useDeleteChatMutation)
  const [leaveGroup, __,leaveGroupData]= useAsyncMutation(useLeaveGroupMutation)
  const chatId= selectedDeleteChat.chatId

  const closeHandler=()=>{
    dispatch(setIsDeleteMenu(false))
    deleteOptionAnchor.current= null
  }

  const leaveGroupHandler=()=>{
    closeHandler()
    leaveGroup("Leaving Group...",{chatId})
  }
  const deleteChatHandler=()=>{
    closeHandler()
    deleteChat("Deleting Chat...",{chatId})
  }

  //immediately navigate to home after action
  useEffect(()=>{
    if(deleteChatData || leaveGroupData){
      navigate("/")
    }
  },[deleteChatData,leaveGroupData])

  return (
    <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteOptionAnchor.current} anchorOrigin={{
      vertical: "bottom", horizontal: "right"
    }} transformOrigin={{
      vertical: "center", horizontal: "center"
    }}>
      <Stack sx={{
        width: '10rem', padding: '0.5rem', cursor: 'pointer'
      }} direction={'row'} alignItems={'center'} spacing={'0.5rem'} onClick={selectedDeleteChat.groupChat? leaveGroupHandler : deleteChatHandler}>
        {
          selectedDeleteChat.groupChat? (
            <> 
              <ExitToApp/>
              <span className='nes-text' style={{fontSize: '0.5rem'}}>
                Leave Group </span>
            </>
          ): ( 
            <> 
              <Delete/>
              <span className='nes-text' style={{fontSize: '0.5rem'}}>
                Unfriend  </span>
            </> 
          )
        }
      </Stack>
    </Menu>
  )
}

export default DeleteChatDialog