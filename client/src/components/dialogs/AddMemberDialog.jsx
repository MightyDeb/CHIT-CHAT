import React, { useEffect, useState } from 'react'
import { Button, Dialog, Skeleton, Stack,  } from '@mui/material'
import toast from 'react-hot-toast'
import UserItem from '../shared/UserItem'
import { useAsyncMutation } from '../../hooks/hook'
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '../../redux/reducers/misc'

//DIALOG FOR ADDING MEMBERS IN GROUPS

const AddMemberDialog = ({chatId}) => {
  const dispatch= useDispatch() //dispatch
  const {isAddMember}= useSelector(state=> state.misc)  //accessing state  from redux store
  
  //RTK query
  const {isLoading,data,isError,error}= useAvailableFriendsQuery(chatId)   //GET friends not present in the group
  const [addMembers,isLoadingAddMembers]= useAsyncMutation(useAddGroupMembersMutation)  //PUT members in the group

  const [selectedMembers,setSelectedMembers]= useState([])
  
  //error handling from RTK queries
  const errors= [{isError, error}]
  useEffect(()=>{
    errors.forEach(({isError,error})=>{
      if(isError){
        return ()=> toast.error(error?.data?.message || 'Something went wrong')
      }
    }) 
  },[errors])

  //adds member if not selected, removes member if selected
  const selectMemberHandler=(id)=>{
    setSelectedMembers(prev=> prev.includes(id)? prev.filter((i)=> i!==id) :[...prev,id])
  }

  // add/remove member handler
  const addMemberSubmitHandler=()=>{
    addMembers("Adding Mmembers...",{members: selectedMembers,chatId})
    closeHandler()
  }

  //close handler
  const closeHandler=()=>{
    setSelectedMembers([])
    dispatch(setIsAddMember(false))
  }

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack p={'2rem'} width={'fit-content'} spacing={'2rem'}>
        <h3 className='nes-text is-primary' style={{ textDecoration: 'underline', textAlign: 'center'}}>
          Add Member
        </h3>
        <Stack spacing={'1rem'}>
          { isLoading ? <Skeleton/> : 
            data?.friends?.length>0 ? 
              data?.friends?.map(i=>
                <UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/>
              ) : 
              <span className='nes-text' style={{fontSize: '0.7rem', textAlign: 'center'}}>No Friends</span>
          }
        </Stack>
        <Stack direction={'row'} justifyContent={'space-evenly'} alignItems={'center'}>
          <Button color='error' onClick={closeHandler}>Cancel</Button>
          <Button onClick={addMemberSubmitHandler}  disabled={isLoadingAddMembers}>Submit Changes</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default AddMemberDialog