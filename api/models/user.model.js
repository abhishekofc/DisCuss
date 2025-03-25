import mongoose from "mongoose";

const userschema = new mongoose.Schema({
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  bio: {
    type: String,
    trim: true,
    default:""
  },
  avatar: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
},{timestamps:true});

const User = mongoose.model("User", userschema); // Capitalized "User"
export default User;