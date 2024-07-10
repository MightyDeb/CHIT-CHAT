import { Add, Remove } from '@mui/icons-material'
import { Avatar, Backdrop, IconButton, ListItem, Stack, Typography } from '@mui/material'
import React, { memo, Suspense } from 'react'
import { transformImage } from '../../lib/features'
import { setIsOpenProfile, setSeeProfileOf } from '../../redux/reducers/misc'
import { useDispatch, useSelector } from 'react-redux'
import ProfileInfoDialog from '../dialogs/ProfileInfoDialog'

const UserItem = ({user,handler,handlerIsLoading,isAdded=false,styling={}}) => {
  const dispatch= useDispatch()
  const {isOpenProfile}= useSelector(state=> state.misc)
  //destructuring data from user
  const {name,_id,avatar}=user

  const openProfile=()=>{
    dispatch(setSeeProfileOf(_id))
    dispatch(setIsOpenProfile(true))
  }

  return (
    <ListItem>
      <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} width={'100%'} {...styling}>
        {
          isOpenProfile && 
          <Suspense fallback={<Backdrop open/>}><ProfileInfoDialog /></Suspense>
        }
        <Avatar src={transformImage(avatar)} onClick={openProfile}/>
        <Typography variant='body1' sx={{
          flexGlow: 1, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%'}}>
            <span className='nes-text' style={{
              fontSize: '0.5rem'
            }}>
              {name}
            </span>
        </Typography>
        <IconButton size='small' sx={{
          bgcolor: isAdded? 'error.main':'primary.main', color: 'white', '&:hover':{ bgcolor: isAdded? 'error.dark':'primary.dark' },}} onClick={()=> handler(_id)} disabled={handlerIsLoading}>
            {isAdded? <Remove/> : <Add/>}
        </IconButton>
      </Stack>
    </ListItem>
  )
}

export default memo(UserItem)
//Using memo will cause React to skip rendering a component if its props have not changed. It is a good practice.