import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Box, Typography } from '@mui/material'
import background from '../constants/Images/homeBg.webp'
import mascot from '../constants/Images/mascot.png'
const Home = () => {
  return (
    <Box sx={{
      backgroundImage: `url(${background})`, overflow: 'hidden', position: 'relative'
    }} height={'100%'}>
      <Typography p={'2rem'} variant='h5' textAlign={'center'} >
        <p className="nes-text" style={{
          marginTop: '45%', color: '#33582B', textShadow: '0 0 3px white, 0 0 5px white'
        }}>Select a friend to chat</p>
      </Typography>
      <img src={mascot} style={{
        position: 'absolute', bottom: '-10', right: '0'
      }}/>
    </Box>
    
  )
}

export default AppLayout()(Home)