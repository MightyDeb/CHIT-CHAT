import React, { useState } from 'react'
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import {CameraAlt as Camera} from "@mui/icons-material"
import { VisuallyHiddenInput } from '../components/styles/StyledComponents'
import {useFileHandler, useInputValidation} from '6pp'
import axios from 'axios'
import { server } from '../constants/config'
import { useDispatch } from 'react-redux'
import { userExists } from '../redux/reducers/auth'
import toast from 'react-hot-toast'
import registerBg from '../constants/Images/registerBg.gif'

const Register = () => {
  const [isLoading,setIsLoading]= useState(false)
  const name= useInputValidation("")
  const username= useInputValidation("")
  const bio=useInputValidation("")
  const password=useInputValidation("")
  const avatar= useFileHandler("single",2)
  const dispatch= useDispatch()

  //formData to signUp
  const handleSignUp= async(e)=>{
    setIsLoading(true)
    e.preventDefault()
    const formData= new FormData()
    formData.append("avatar", avatar.file)
    formData.append("name", name.value)
    formData.append("bio", bio.value)
    formData.append("username", username.value)
    formData.append("password", password.value)
    try {
      const {data} = await axios.post(`${server}/api/v1/user/register`,formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      dispatch(userExists(data.user))
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div style={{ 
      backgroundImage: `url(${registerBg})`, backgroundRepeat: 'repeat'
    }}>
    <Container component={'main'} maxWidth='xs' sx={{
      height: 'fit-content',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      
    }}>
      <Paper elevation={3} sx={{
        padding: 4, display: 'flex', 
        flexDirection: 'column', alignItems: 'center', backgroundColor: '#E9E6E5'
      }}>
        <h2 className='nes-text'>
          REGISTER
        </h2>
        <progress class="nes-progress is-pattern" value="70" max="100"></progress>
        <form style={{width: '100%',marginTop: '1rem'
        }} onSubmit={handleSignUp}>
          <Stack position={'relative'} width={'10rem'} margin={'auto'}>
            <Avatar sx={{  width:'10rem', height:'10rem', objectFit:"contain"}} src={avatar.preview}/>
            <IconButton sx={{
              position: 'absolute', bottom: '0', right: '0', bgcolor: 'rgba(0,0,0,0.4)', ":hover":{
                bgcolor: 'rgba(255,255,255,0.8)'
              }
            }} component='label'>
              <>
                <Camera/>
                <VisuallyHiddenInput type="file" onChange={avatar.changeHandler}/>
              </>
            </IconButton>
          </Stack>
          {
            avatar.error && (
              <Typography m={"1rem auto"} width={'fit-content'} display={'block'} color='error' variant='caption'>
                {avatar.error}
              </Typography>
            )
          }
          <label for="name_field" style={{
            marginTop: '2rem'
          }}>Name</label>
          <input required type="text" id="name_field" className="nes-input" value={name.value} onChange={name.changeHandler} />
          <label for="username_field">Username</label>
          <input required type="text" id="username_field" className="nes-input" value={username.value} onChange={username.changeHandler}/>
          {
            username.error && (
              <Typography color='error' variant='caption'>
                {username.error}
              </Typography>
            )
          }
          <label for="password_field">Password</label>
          <input required type="password" id="password_field" className="nes-input"  value={password.value} onChange={password.changeHandler}/>
          {
            password.error && (
              <Typography color='error' variant='caption'>
                {password.error}
              </Typography>
            )
          }
          <label for="bio_field">Bio</label>
          <input type="text" id="bio_field" className="nes-input"  value={bio.value} onChange={bio.changeHandler} style={{
            marginBottom: '1.5rem'
          }}/>
          <button type="submit" class="nes-btn is-primary" disabled={isLoading}>Register</button>
          <p style={{marginTop: '0.5rem'}}>Already registered?  
          <span style={{
            fontSize: '0.7rem'
          }}><Link to='/login'> Sign In </Link></span> </p>
          
        </form>
      </Paper>
    </Container>
    </div>
  )
}

export default Register