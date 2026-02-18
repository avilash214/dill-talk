import { setMessages, setMessagesL } from "@/Redux/chatSlice";

import {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";


const useGetRTM=()=>{
    const dispatch=useDispatch(); 
    const {socket}=useSelector(store=>store.socketio)
    const {messages}=useSelector(store=>store.chat)
    const {messagesL}=useSelector(store=>store.chat)
    useEffect(()=>{
        socket?.on('newMessage',(newMessage)=>{
            dispatch(setMessages([...messages,newMessage]))
            dispatch(setMessagesL([...messagesL,newMessage]))
        })
        return()=>{
            socket?.off('newMessage')
        }
    },[messages,setMessages]);
};
export default useGetRTM;