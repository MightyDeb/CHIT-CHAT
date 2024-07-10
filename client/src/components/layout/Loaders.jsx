import React from 'react'
import { Grid, Skeleton, Stack } from '@mui/material'
import { BouncingSkeleton } from '../styles/StyledComponents'

//loader when the elements are loading
export const LayoutLoader= ()=>{
  return(
    <Grid container height={"calc(100vh-4rem)"} >
      <Grid item sm={4} md={3} sx={{
        display: {xs:'none',sm:'block'},
        padding:'2rem'}} height={'100vh'} >
        <Skeleton variant='rectangular' height={'100vh'}/>
      </Grid>
      <Grid item xs={12} sm={8} md={5} lg={6}height={'100vh'}>
        <Skeleton variant='rectangular' height={'100vh'}/>  
      </Grid>
      <Grid item md={4} lg={3} sx={{
        display: {xs:'none',md:'block'},
        padding:'2rem', }} height={'100vh'}>
        <Skeleton variant='rectangular' height={'100vh'}/>
      </Grid>
    </Grid>
  )
}

//loader when typing
export const TypingLoader= ()=>{
  return <Stack spacing={'0.5rem'} direction={'row'} padding={'0.5rem'} justifyContent={'center'} sx={{
    zIndex: '11'}}>
    <BouncingSkeleton variant='circular' width={15} height={15} style={{
      animationDelay: "0.1s"
    }} />
    <BouncingSkeleton variant='circular' width={15} height={15} style={{
      animationDelay: "0.2s"
    }}/>
    <BouncingSkeleton variant='circular' width={15} height={15} style={{
      animationDelay: "0.4s"
    }}/>
    <BouncingSkeleton variant='circular' width={15} height={15} style={{
      animationDelay: "0.6s"
    }}/>
  </Stack>
}