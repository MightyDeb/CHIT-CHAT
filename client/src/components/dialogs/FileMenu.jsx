import {ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setUploadingLoader } from '../../redux/reducers/misc'
import { Image,AudioFile, VideoFile, UploadFile } from '@mui/icons-material'
import toast from 'react-hot-toast'
import { useSendAttachmentsMutation } from '../../redux/api/api'

//FILE SEND DIALOG NEAR TEXT INPUT MESSAGE BOX

const FileMenu = ({anchorE1,chatId}) => {
  //utility variables
  const dispatch= useDispatch()
  const imageRef= useRef(null)
  const audioRef= useRef(null)
  const videoRef= useRef(null)
  const fileRef= useRef(null)
  //redux state
  const {isFileMenu}= useSelector(state=> state.misc)

  //rtk queries
  const [sendAttachments]= useSendAttachmentsMutation()

  const closeFileMenu= ()=> 
    dispatch(setIsFileMenu(false))

  //useRef() hook used to open the dialog at a specific position, acting like anchors
  const selectRef= (ref)=>{
    ref.current?.click()
  }
  
  const fileChangeHandler= async (e,key)=>{

    const files= Array.from(e.target.files)
    if(files.length <= 0) 
      return
    if(files.length>5) 
      return toast.error(`You can only upload 5 ${key} at a time`)
    dispatch(setUploadingLoader(true))
    const toastId= toast.loading(`Sending ${key}...`)
    closeFileMenu()
    //uploading the file(s) selected using FormData
    try {
      const myForm= new FormData()
      myForm.append("chatId", chatId)
      //"files" also written in attachmentMulter
      files.forEach((file)=> myForm.append("files", file)) 
      const res= await sendAttachments(myForm)
      if(res.data){
        toast.success(`${key} sent successfully`, {id: toastId})
      }else{
        toast.error(`Failed to send ${key}`, {id: toastId})
      }
    } catch (error) {
      toast.error(error, {id: toastId})
    } finally {
      //close the dialog after sending
      dispatch(setUploadingLoader(false))
    }
  }

  return (
    <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeFileMenu} >
      <div style={{ width: "10rem"}}>
        <MenuList>
          <MenuItem onClick={()=> selectRef(imageRef)}>
            <Tooltip title="Image">
              <Image/>
            </Tooltip>
            <ListItemText style={{
              marginLeft: "0.5rem"
            }}>Image</ListItemText>
            <input type='file' multiple accept="image/png, image/jpeg, image/gif" style={{ display: "none" }} onChange={(e)=> fileChangeHandler(e, "Images")} ref={imageRef}/>
          </MenuItem>
          <MenuItem onClick={()=> selectRef(audioRef)}>
            <Tooltip title="Audio">
              <AudioFile />
            </Tooltip>
            <ListItemText style={{
              marginLeft: "0.5rem"
            }}>Audio</ListItemText>
            <input type='file' multiple accept="audio/mpeg, audio/wav" style={{ display: "none" }} onChange={(e)=> fileChangeHandler(e, "Audios")} ref={audioRef}/>
          </MenuItem>
          <MenuItem onClick={()=> selectRef(videoRef)}>
            <Tooltip title="Video">
              <VideoFile/>
            </Tooltip>
            <ListItemText style={{
              marginLeft: "0.5rem"
            }}>Video</ListItemText>
            <input type='file' multiple accept="video/mp4, video/webm, video/ogg" style={{ display: "none" }} onChange={(e)=> fileChangeHandler(e, "Videos")} ref={videoRef}/>
          </MenuItem>
          <MenuItem onClick={()=> selectRef(fileRef)}>
            <Tooltip title="File">
              <UploadFile/>
            </Tooltip>
            <ListItemText style={{
              marginLeft: "0.5rem"
            }}>File</ListItemText>
            <input type='file' multiple accept="*" style={{ display: "none" }} onChange={(e)=> fileChangeHandler(e, "Files")} ref={fileRef}/>
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  )
}

export default FileMenu