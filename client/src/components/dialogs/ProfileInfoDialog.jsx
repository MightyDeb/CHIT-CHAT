import React from 'react'
import {Avatar, Dialog, Stack} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setIsOpenProfile } from '../../redux/reducers/misc'
import { useUserProfileQuery } from '../../redux/api/api'

//DIALOG TO VIEW USER PROFILE

const ProfileInfoDialog = () => {
  //utility variables
  const dispatch= useDispatch()

  const {isOpenProfile,seeProfileOf}= useSelector((state)=> state.misc)
  const userId= seeProfileOf
  const profileDetails= useUserProfileQuery({userId,skip: !userId})

  const profileCloseHandler= ()=>{
    dispatch(setIsOpenProfile(false))
  }

  return (
    <Dialog open={isOpenProfile} onClose={profileCloseHandler}>
      <Stack width={'fit-content'} margin={'auto'} p={'1rem'} 
      sx={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderRadius: '10px', backgroundColor: '#B91E1E'
      }}>
        <Avatar sx={{  width:'10rem', height:'10rem', objectFit:"contain", border: '2px solid ', marginBottom: '1rem'}} src={profileDetails?.data?.user?.avatar?.url}/>
        <p className="nes-text is-warning">Name</p>
        <h5 className='nes-text'>{profileDetails?.data?.user?.name}</h5>
        <p className="nes-text is-warning">Username</p>
        <h5 className='nes-text'>{profileDetails?.data?.user?.username}</h5>
        <p className="nes-text is-warning">Bio</p>
        <h5 className='nes-text' >{profileDetails?.data?.user?.bio}</h5>
      </Stack>
    </Dialog>
  )
}

export default ProfileInfoDialog