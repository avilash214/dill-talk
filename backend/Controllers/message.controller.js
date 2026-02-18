import {Conversation} from "../Models/conversation.model.js"
import { Message } from "../Models/message.model.js";
import { getReceiverSocketId, io } from "../Socket/socket.js";
import { subDays } from 'date-fns';
//for chatting
export const sendMessage=async(req,res)=>{
    try {
        const senderId=req.id;
        const receiverId=req.params.id;
        const {textMessage:message}=req.body;
        console.log(message);
        
        let conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        });
        //extablished the conversation  if not started 

        if(!conversation){
            conversation=Conversation.create({
                participants:[senderId,receiverId]
            })
        }
        const newMessage=await Message.create({
            senderId,
            receiverId,
            message
        })
        if(newMessage) conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(),newMessage.save()])

        //implement socket io for real time data transfer
        const receiverSocketId = getReceiverSocketId(receiverId);
            if(receiverSocketId){
                io.to(receiverSocketId).emit('newMessage',newMessage);
            }
        return res.status(201).json({
            success:true,
            newMessage
        })
    } catch (error) {
        console.log(error)
    }
}
export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const thirtyDaysAgo = subDays(new Date(), 30); // Calculate the date 30 days ago

        // Fetch the conversation and filter messages from the last 30 days
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate({
            path: 'messages',
            match: { createdAt: { $gte: thirtyDaysAgo } } // Filter messages from the last 30 days
        });

        if (!conversation) return res.status(200).json({ success: true, messages: [] });

        // Delete messages older than 30 days
        await Message.deleteMany({
            _id: { $in: conversation.messages.map(msg => msg._id) },
            createdAt: { $lt: thirtyDaysAgo }
        });

        // Refetch the conversation to get the updated messages
        conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');

        return res.status(200).json({ success: true, messages: conversation?.messages });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}