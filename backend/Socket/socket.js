import {Server} from "socket.io";
import express from "express";
import http from "http";
import { log } from "console";
const app=express();

const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:'https://dilltalks.onrender.com',
        methods:['GET','POST'],
    }
   
})
const userSocketMap={};//this map stores socket id corresponding the user id;user id->socket.id

export const getReceiverSocketId=(receiverId)=>userSocketMap[receiverId]
io.on('connection', (socket)=>{
    const userId=socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]=socket.id;
        console.log(`User connected:UserId=${userId},SocketId=${socket.id}`);
        
    }
    io.emit('getOnlineUsers',Object.keys(userSocketMap))
    socket.on('disconnect',()=>{
        if(userId){
            console.log(`User disconnected:UserId=${userId},SocketId=${socket.id}`);
            delete userSocketMap[userId];

        }
        io.emit('getOnlineUsers',Object.keys(userSocketMap))
        
    })
})
export {app,server,io};