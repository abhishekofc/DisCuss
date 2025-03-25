import express from "express";
// const app=express()
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import mongoose from "mongoose";
import authrouter from "./routes/auth.routes.js";
import userrouter from "./routes/user.routes.js";
import categoryroute from "./routes/category.routes.js";
import blogroutes from "./routes/blog.route.js";
import commentroute from "./routes/comment.route.js";
import messageRoute from "./routes/message.route.js"
import likeroute from "./routes/likecount.route.js";
import {app,server} from "./socket/socket.js";


dotenv.config()
const port=process.env.PORT

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))


app.use('/api/auth',authrouter)
app.use('/api/user',userrouter)
app.use('/api/category',categoryroute)
app.use('/api/blog',blogroutes)
app.use('/api/comment',commentroute)
app.use('/api/like',likeroute)
app.use("/api/message",messageRoute)


mongoose.connect(process.env.MONGODB_CONN,{dbname:"DisCuss"})
.then(()=>console.log("connected successfully"))
.catch(err=> console.log(err))

server.listen(port,()=>{
    console.log("server is running on port ",port);
})



app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500
    const message=err.message||"Internal server error"
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})