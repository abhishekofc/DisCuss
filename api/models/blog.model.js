import mongoose from "mongoose"

const blogschema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true,
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    blogContent: {
        type: String,
        required: true,
        trim: true
      },
      
    featuredimage:{
        type:String,
        required:true,
        trim:true    
    }
},{timestamps:true})

const blog=mongoose.model("Blog",blogschema,'blogs')
export default blog