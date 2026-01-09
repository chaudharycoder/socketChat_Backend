
import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';
import { asyncHandler } from '../utilities/ayncHandler.js';
import { errorHandler } from '../utilities/errorHandler.js';
import {io,getSocketId} from '../socket/socket.js'


export const sendMessage=asyncHandler(async(req,res,next)=>{
const senderId=req.user._id;
const receiverId=req.params.receiverId;
const message=req.body.message;
if(!senderId || !receiverId || !message)
{
    return next(new errorHandler("All fields are requird",400));
}
let conversation=await Conversation.findOne({
    participants:{$all:[senderId,receiverId]}
})

if(!conversation)
{
    conversation=await Conversation.create({
        participants:[senderId,receiverId]
    })
}

const newMessage=await Message.create({
    senderId,
    receiverId,
    message
});
if(newMessage)
{
    conversation.message.push(newMessage._id);
    await conversation.save();
}

//socket.io
const socketId=getSocketId(receiverId)
if(socketId)
{
io.to(socketId).emit('newMessage',newMessage)
}



res.status(200).json({
    success:true,
    responseData:newMessage
  })
});

export const getMessages = asyncHandler(async (req, res, next) => {
    const myId = req.user._id;
    const otherParticipantId = req.params.otherParticipantId;
  
    if (!myId || !otherParticipantId) {
      return next(new errorHandler("All fields are required", 400));
    }
  
    let conversation = await Conversation.findOne({
      participants: { $all: [myId, otherParticipantId] },
    }).populate("message")
  
    res.status(200).json({
      success: true,
      responseData: conversation,
    });
  });