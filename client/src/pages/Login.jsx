import { Button, Container, Paper, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {useInputValidation} from '6pp'

import axios from 'axios'
import { server } from '../constants/config'
import { useDispatch } from 'react-redux'
import { userExists } from '../redux/reducers/auth'
import toast from 'react-hot-toast'
import registerBg from '../constants/Images/registerBg.gif'




const Login = () => {
  const [isLoading,setIsLoading]= useState(false)
  const username= useInputValidation("")
  const password=useInputValidation("")
  const dispatch= useDispatch()
  const handleLogin= async(e)=>{
    setIsLoading(true)
    e.preventDefault()
    try {
      const {data} = await axios.post(`${server}/api/v1/user/login`, {
        username: username.value,
        password: password.value
      },{
        withCredentials: true, headers: {
          "Content-Type": "application/json",
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
      height: '100vh',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Paper elevation={3} sx={{
        padding: 4, display: 'flex', 
        flexDirection: 'column', alignItems: 'center', backgroundColor: '#E9E6E5'
      }}>
        <h2 className='nes-text'>
          LOGIN
        </h2>
        <progress class="nes-progress is-pattern" value="70" max="100"></progress>
        <form style={{
          width: '100%',
          marginTop: '1rem'
        }} onSubmit={handleLogin}>
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
          <input required type="password" id="password_field" className="nes-input"  value={password.value} onChange={password.changeHandler} />
          {
            password.error && (
              <Typography color='error' variant='caption'>
                {password.error}
              </Typography>
            )
          }
          <button type="submit" class="nes-btn is-primary" disabled={isLoading} style={{
            marginTop: '1.5rem'
          }}>Login</button>
          <p style={{marginTop: '0.5rem'}}>Not registered already?  
          <span style={{
            fontSize: '0.7rem'
          }}><Link to='/register'> Regsiter</Link></span> </p>
        </form>
      </Paper>
    </Container>
    </div>
  )
}

export default Login