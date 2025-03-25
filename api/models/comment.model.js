import mongoose from "mongoose"

const commentschema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    blogid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog",
        required:true,
    },
    comment:{
        type:String,
        required:true,
        trim:true
    },
},{timestamps:true})

const Comment=mongoose.model("Comment",commentschema,'Comments')
export default Comment