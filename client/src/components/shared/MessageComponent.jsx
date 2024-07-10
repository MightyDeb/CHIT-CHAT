import { Typography,Box } from '@mui/material';
import moment from 'moment';
import React, { memo } from 'react'
import { fileFormat } from '../../lib/features';
import RenderContent from './RenderContent';
import {motion} from 'framer-motion'

const MessageComponent = ({message,user}) => {
  const {sender,content,attachments=[],createdAt}= message;
  const sameSender= sender?._id===user?._id
  const timeAgo= moment(createdAt).fromNow()
  return (
    <motion.div 
      initial={{opacity: 0, x: "-100%"}}
      whileInView={{opacity: 1, x: 0}}
      style={{
        alignSelf: sameSender?'flex-end':'flex-start',
        backgroundColor: sameSender?'lightgreen':'white', color: 'black', borderRadius: '5px', padding: '0.5rem', width: 'fit-content', border: '0.1px solid black'
      }}
    >
      {
        !sameSender && 
        <Typography color={'#2694ab'} fontWeight={'700'} variant='caption'>
          {sender.name}
        </Typography>
      }
      {
        content && <Typography>{content}</Typography>
      }
      {
        attachments.length> 0 && attachments.map((attachment,index)=>{
          const url= attachment.url
          const file=fileFormat(url);
          return <Box key={index}>
            <a href={url} target='_blank' download style={{ color: 'black'}}>{RenderContent(file,url)}</a>
          </Box>
        })
      }
      <Typography variant='caption' color={'text.secondary'} >{timeAgo}</Typography>
    </motion.div>
  )
}

export default memo(MessageComponent)