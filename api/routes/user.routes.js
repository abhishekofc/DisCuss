import express from "express"
import  {deleteuser, getalluser, getuser,updateuser}  from "../controllers/user.controllers.js"
import upload from "../config/multer.js";
import { authenticate } from "../authenticate.js";

const userrouter=express.Router()
// userrouter.use(authenticate)

userrouter.get('/get-user/:userId',getuser)
userrouter.delete('/delete/:userId',deleteuser)
userrouter.get('/get-all',getalluser)
userrouter.put('/update-user/:userId',upload.single('file'),updateuser);


export default userrouter