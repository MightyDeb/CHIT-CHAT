import React,{lazy, Suspense, useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute'
import axios from 'axios'
import { server } from './constants/config'
import { useDispatch, useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { userExists, userNotExists } from './redux/reducers/auth'
import { LayoutLoader } from './components/layout/Loaders'
import {SocketProvider} from './socket'

const Home= lazy(()=> import("./pages/Home"))
const Login= lazy(()=> import("./pages/Login"))
const Register= lazy(()=> import('./pages/Register'))
const Chat= lazy(()=> import("./pages/Chat"))
const Groups= lazy(()=> import("./pages/Groups"))
const NotFound= lazy(()=> import("./pages/NotFound"))
const Community= lazy(()=> import("./pages/Community"))

const App = () => {
  const {user,loader} = useSelector(state=> state.auth)
  const dispatch = useDispatch()
  useEffect(()=>{
    axios.get(`${server}/api/v1/user/me`,{withCredentials: true})
    .then(({data})=> dispatch(userExists(data.user)))
    .catch(err=> dispatch(userNotExists()))
  },[dispatch])
  return loader? (
    <LayoutLoader />
  ) : (
    <Router>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route element={
            <SocketProvider>
              <ProtectRoute user={user} />
            </SocketProvider>
          }>
            <Route path='/' element={<Home/>} />
            <Route path='/chat/:chatId' element={<Chat/>} />
            <Route path='/groups' element={<Groups/>} />
            <Route path='/communities' element={<Community/>} />
          </Route>
          <Route element={<ProtectRoute user={!user} redirect='/'/>}>
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
          </Route>
        <Route path="*" element={<NotFound/>} />
      </Routes>
      <Toaster position="bottom-center"/>
      </Suspense>
    </Router>
  )
}

export default App
