import { useEffect, useState } from "react"
import toast from "react-hot-toast"


//hook to manage RTK Mutate Queries 
const useAsyncMutation= (mutationHook)=>{
  const [isLoading, setIsLoading]= useState(false)
  const [data,setData]= useState(null)
  const [mutate]= mutationHook()
  const executeMutation= async (toastMessage,...args)=>{
    setIsLoading(true)
    const toastId= toast.loading(toastMessage || "Updating data...")
    try {
      const res= await mutate(...args)
      if(res.data){
        toast.success(res.data.message || "Updated data successfully",{id: toastId})
      }else{
        toast.error(res.error?.data?.message || "Something went wrong",{id: toastId})
      }
      setData(res.data)
    } catch (error) {
      toast.error("Something went wrong",{id: toastId})
    }finally{
      setIsLoading(false)
    }
  }
  return [executeMutation,isLoading,data]
}

//hook to handle socket events and listeners
const useSocketEvents= (socket,handlers)=>{
  useEffect(()=>{
    Object.entries(handlers).forEach(([event,handler])=>{
      socket.on(event, handler)
    })
    return ()=>{
      Object.entries(handlers).forEach(([event,handler])=>{
        socket.off(event, handler)
      })
    }
  },[socket,handlers])
}


export {useAsyncMutation, useSocketEvents}