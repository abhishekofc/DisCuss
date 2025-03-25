 import {Server} from 'socket.io';
 import http from 'http';
 import express from "express";
 const app=express();

 const server=http.createServer(app);
 const io=new Server(server,{
        cors:{
            origin:process.env.FRONTEND_URL,
        }
});

const userSocketMap={}; //{userId,socketId}
export function getreceiverSocketId(userId){
    return userSocketMap[userId]
}


io.on("connection",(socket)=>{
    console.log("a user connected",socket.id);

    const userId=socket.handshake.query.userId;
    userSocketMap[userId]=socket.id;

    //io.emit() is used to send events to all connected clients
    io.emit("setOnlineUsers",Object.keys(userSocketMap));
    
    socket.on("disconnect",()=>{
        console.log("a user disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("setOnlineUsers",Object.keys(userSocketMap));
    })

})

export {io,app,server};