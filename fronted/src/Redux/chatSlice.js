import { createSlice } from "@reduxjs/toolkit";
const chatSlice=createSlice({
    name:"chat",
    initialState:{
        onlineUsers:[],
        messages:[],
        messagesL:[],

    },
    reducers:{
        setOnlineUsers:(state,action)=>{
            state.onlineUsers=action.payload
        },
        setMessages:(state,action)=>{
            state.messages=action.payload
        },
        setMessagesL:(state,action)=>{
            state.messagesL=action.payload
        },
        setEmptyMessagesL:(state)=>{
            state.messagesL=[];
        },
    }
})
export const{setOnlineUsers,setMessages,setMessagesL,setEmptyMessagesL}=chatSlice.actions
export default chatSlice.reducer;