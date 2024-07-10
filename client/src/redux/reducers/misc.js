import { createSlice } from "@reduxjs/toolkit";

const initialState={
  isNewGroup: false,
  isAddMember: false,
  isNotification: false,
  isMobileMenu: false,
  isSearch: false,
  isFileMenu: false,
  isDeleteMenu: false,
  isOpenProfile: false,
  uploadingLoader: false,
  seeProfileOf: "",
  selectedDeleteChat: {
    chatId: "",
    groupChat: false
  }
}

const miscSlice= createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsNewGroup: (state,action)=>{
      state.isNewGroup= action.payload
    },
    setIsAddMember: (state,action)=>{
      state.isAddMember= action.payload
    },
    setIsNotification: (state,action)=>{
      state.isNotification= action.payload
    },
    setIsMobileMenu: (state,action)=>{
      state.isMobileMenu= action.payload
    },
    setIsSearch: (state,action)=>{
      state.isSearch= action.payload
    },
    setIsOpenProfile: (state,action)=>{
      state.isOpenProfile= action.payload
    },
    setIsFileMenu: (state,action)=>{
      state.isFileMenu= action.payload
    },
    setIsDeleteMenu: (state,action)=>{
      state.isDeleteMenu= action.payload
    },
    setUploadingLoader: (state,action)=>{
      state.uploadingLoader= action.payload
    },
    setSelectedDeleteChat: (state,action)=>{
      state.selectedDeleteChat= action.payload
    },
    setSeeProfileOf: (state,action)=>{
      state.seeProfileOf= action.payload
    },
  }
})

export default miscSlice
export const {setIsNewGroup,
setIsAddMember,
setIsNotification,
setIsMobileMenu,
setIsSearch,
setIsOpenProfile,
setIsFileMenu,
setIsDeleteMenu,
setUploadingLoader,
setSelectedDeleteChat,setSeeProfileOf} = miscSlice.actions