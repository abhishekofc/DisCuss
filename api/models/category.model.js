import mongoose from "mongoose";

const cateogryschema=new mongoose.Schema({
    name:{
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
})

const Category=mongoose.model("Category",cateogryschema)
export default Category;