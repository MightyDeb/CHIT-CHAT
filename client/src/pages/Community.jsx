import { Box, Card, CardActionArea, CardContent, CardMedia, Container, Grid, Paper, Skeleton, Typography } from '@mui/material'
import React, { useEffect } from 'react'

import grp5 from '../constants/Images/community.jpg'
import { useDispatch } from 'react-redux'
import { useCommunitiesQuery } from '../redux/api/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Home } from '@mui/icons-material'
const Community = () => {
  const navigate= useNavigate()
  const dispatch= useDispatch()
  const myCommunities= useCommunitiesQuery("")
  
  const errors= [{isError: myCommunities.isError, error: myCommunities.error}]
  useEffect(()=>{
    errors.forEach(({isError,error})=>{
      if(isError){
        return ()=> toast.error(error?.data?.message || 'Something went wrong')
      }
    }) 
  },[errors])

  const goHome=()=>{
    navigate("/")
  }
  return (
    <Container  sx={{
      display: 'flex', alignItems: 'center', flexDirection: 'column', backgroundColor: '#3BA2C5', padding: '1rem'
    }}>
      <Typography variant='h5' align='center' style={{
        marginTop: "1.5rem"
      }}>
        <span className='nes-text' style={{
          textDecoration: 'underline'
        }}>ALL COMMUNITIES</span>
      </Typography>
      <button onClick={goHome} style={{
        marginTop: '0.5rem'
      }}><Home/> Go Home</button>
      {myCommunities.isLoading? <Skeleton/> : 
      <Grid container spacing={5} style={{
        marginTop: "2rem", height: "80vh", overflow: 'auto'
      }}>
        {myCommunities?.data?.communities?.map((i)=> {
          
          return(
        <Grid item xs={12} sm={6} sx={{
          
        }}>
          <Paper elevation={3}>

          
          <Card sx={{
            backgroundColor: '#B04A1F'
          }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={grp5}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            <span className='nes-text'>{i.name}</span>
          </Typography>
          <Grid container direction='row' spacing={1}>
            <Grid item xs={10}>
            <span style={{
            fontSize: '0.5rem'
          }}>Created by {i.creator.name}</span>
            </Grid>
          <Grid item xs={2}>
          <img src={i.creator.avatar.url} width={30} height={30} style={{borderRadius: '50%'}}/>
          </Grid>
          
          </Grid>
          
          <button>{i.memberCount} members</button>
          <span></span>
        </CardContent>
      </CardActionArea>
    </Card>
    </Paper>
      </Grid>
          )
        })}
        
        
      </Grid>
      }
      
    </Container>
  )
}

export default Community