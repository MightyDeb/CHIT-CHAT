import { AlternateEmail, AutoGraph, Face } from '@mui/icons-material'
import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import moment from 'moment'
import { transformImage } from '../lib/features'

const Profile = ({user}) => {
  return (
    <Stack spacing={'2rem'} vdirection={'column'} alignItems={'center'}>
      <Avatar sx={{width: 200, height:200, objectFit:'contain', marginBottom:'1rem', border: '10px solid black'}} src={transformImage(user?.avatar?.url)} />
      <ProfileCard heading={'Bio'} text={user?.bio.length>25 ? user?.bio.substring(0,22)+"..." : user?.bio} Icon={<AutoGraph/>} />
      <ProfileCard heading={'Username'} text={user?.username} Icon={<Face/>}/>
      <ProfileCard heading={'Name'} text={user?.name} Icon={<AlternateEmail/>}/>
      <ProfileCard heading={'Joined'} text={moment(user?.createdAt).fromNow()} Icon={<AlternateEmail/>}/>
    </Stack>
  )
}

const ProfileCard=({text,Icon,heading})=> (
  <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} textAlign={'center'}>
    { Icon && Icon }
    <Stack>
    <Typography color={'black'} variant='body1'>
      <span  style={{
        fontSize: '0.7rem'
      }}className="nes-text ">{text?text:'N.A.'}</span>
    </Typography>
    <Typography color={'black'} variant='caption'>
      <span  style={{
          fontSize: '0.5rem'
      }}className="nes-text ">{heading}</span>
    </Typography>
    </Stack>
  </Stack>
)

export default Profile