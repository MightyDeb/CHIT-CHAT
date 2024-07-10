import React, { memo } from 'react'
import {Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography} from '@mui/material'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../redux/api/api'
import { useAsyncMutation } from '../hooks/hook'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNotification } from '../redux/reducers/misc'

const Notifications = () => {
  const dispatch= useDispatch()

  const {isNotification}= useSelector(state=> state.misc)

  const {isLoading,data}= useGetNotificationsQuery()
  const [acceptRequest]= useAsyncMutation(useAcceptFriendRequestMutation)

  const friendRequestHandler= async({_id,accept})=>{
    dispatch(setIsNotification(false))
    await acceptRequest("Processing Friend Request...",{requestId: _id, accept})
  }
  const closeHandler =()=>{
    dispatch(setIsNotification(false))
  }

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{xs:'1rem',sm:'2rem'}} maxWidth={'25rem'}>
        <DialogTitle>
          <h5 className='nes-text is-primary' style={{
            textDecoration: 'underline'
          }}>Notifications</h5></DialogTitle>
        {isLoading? <Skeleton/> : <>
          {data?.allRequests.length>0? (
            data?.allRequests?.map(({sender, _id})=>
              <NotificationItem sender={sender}  _id={_id} handler={friendRequestHandler} key={_id} />
            )
          ) : <Typography textAlign={'center'}>0 notifications</Typography>
        }
        </>}
        
      </Stack>
    </Dialog>
  )
}

const NotificationItem = memo(({sender,_id,handler})=>{
  const {name,avatar}= sender
  return(
    <ListItem>
      <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} width={'100%'}>
        <Avatar src={avatar}/>
        <Typography variant='body1' sx={{
          flexGlow: 1, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%'}}>{`${name} sent you a friend request`}</Typography>
          <Stack direction={{
            xs: 'column', sm: 'row'
          }}>
            <Button onClick={()=>handler({_id,accept: true})}>
              Accept
            </Button>
            <Button color='error' onClick={()=>handler({_id,reject: true})}>
              Reject
            </Button>
          </Stack>
      </Stack>
    </ListItem>
  )
})


export default Notifications