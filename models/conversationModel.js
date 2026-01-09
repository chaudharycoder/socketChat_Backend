import mongoose from "mongoose";

//schema
const conversationSchema=new mongoose.Schema({
  participants:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    message:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message',
       }]
  
},{timestamps:true});

const conversation=mongoose.model("Conversation",conversationSchema);
export default conversation;