import mongoose from "mongoose";

//schema
const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        requierd:true,
    },
    gender:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        required:true
    }
},{timestamps:true});

const User=mongoose.model("User",userSchema);
export default User;