import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser, setUserProfile} from '@/Redux/authSlice';
import { Button } from './ui/button';
import { MessageCircle, MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/Redux/chatSlice';
import { useGetFollowing } from '@/hooks/useGetFollowing';

const ChatPage = () => {
    
    useGetFollowing();
    const [textMessage,setTextMessage]=useState("")
    const { user, suggestedUsers,selectedUser,followingUser } = useSelector(store => store.auth)
    const chatUsers = user?.followers;
    const {onlineUsers}=useSelector(store=>store.chat)
    const {messages}=useSelector(store=>store.chat)
    
    const sendMessageHandler=async(receiverId)=>{
        try {
            const res=await axios.post(`https://dilltalks.onrender.com/api/v1/message/send/${receiverId}`,{textMessage},{
                headers:{
                    'Content-Type':'application/json'
                },withCredentials:true
            })
            if(res.data.success){
                dispatch(setMessages([...messages,res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    useEffect(()=>{
        return()=>{
            dispatch(setSelectedUser(null))
        }
    },[])

    const dispatch=useDispatch();
    return (
        <div className='flex flex-col lg:flex-row ml-[16%] h-screen'>
          <section className='w-full lg:w-1/4 py-6 border-r-2'>
            <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
            <hr className='mb-4 border-gray-300' />
            <div className='overflow-y-auto h-[80vh]'>
              {
                followingUser?.map((suggestedUser) => {
                  const isOnline = onlineUsers.includes(suggestedUser?._id);
                  return (
                    <div key={suggestedUser._id} onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'>
                      <Avatar className='w-14 h-14'>
                        <AvatarImage src={suggestedUser?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='font-medium'>{suggestedUser?.username}</span>
                        <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>{isOnline ? 'online' : 'offline'}</span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </section>
          {
            selectedUser ? (
              <section className='flex-1 border-l-gray-300 flex flex-col h-full pt-3'>
                <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                  <Avatar>
                    <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span>{selectedUser?.username}</span>
                  </div>
                </div>
                <Messages selectedUser={selectedUser} />
                <div className='flex items-center p-3 border-t border-t-gray-300'>
                  <input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} type='text' className='flex-1 mr-2 outline-none' placeholder='Messages...' />
                  <Button onClick={() => sendMessageHandler(selectedUser._id)}>Send</Button>
                </div>
              </section>
            ) : (
              <div className='flex flex-col items-center justify-center mx-auto'>
                <MessageCircleCode className='w-32 h-32 my-4' />
                <h1 className='font-medium text-xl'>Your messages</h1>
                <span>Send a message to start a chat.</span>
              </div>
            )
          }
        </div>
      );
      
}

export default ChatPage

