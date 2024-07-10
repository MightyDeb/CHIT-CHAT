import React, { memo } from 'react'
import { Link } from '../styles/StyledComponents'
import { Stack, Typography } from '@mui/material'
import AvatarCard from './AvatarCard'
import {motion} from 'framer-motion'

const ChatItem = ({
  avatar=[],name,_id,groupChat=false,sameSender,newMessageAlert,index=0,handleDeleteChat
}) => {
  const openProfileDialog=()=>{

  }
  return (
    <Link sx={{padding: '0'}} to={`/chat/${_id}`} onContextMenu={(e)=>handleDeleteChat(e,_id,groupChat)}>
      <motion.div 
        initial={{opacity: 0, y: "-100%"}}
        whileInView={{opacity: 1, y: 0}}
        transition={{delay: index*0.1}}
        style={{
          display: 'flex',
          gap:'1rem',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: sameSender? '#A0502D': '#CCE7E4',
          color: sameSender? 'white': 'unset',
          position: 'relative',
        }}>
        <AvatarCard key={Math.random()*100} avatar={avatar} onClick={openProfileDialog}/>
        <Stack>
          <p style={{fontSize: '0.7rem'}}>
            {name}
          </p>
          { newMessageAlert && 
            <Typography>
              {newMessageAlert.count} New Messages
            </Typography>
          }
        </Stack>
      </motion.div>
    </Link>
  )
}

export default memo(ChatItem)