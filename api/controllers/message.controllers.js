import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";
import { getreceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";

export const getuserforsidebar = async (req, res) => {
    try {
        
        const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");

        if (!users.length) {
            console.warn("⚠️ No other users found!");
        }

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getmessages=async(req,res)=>{
    try{
        const {id:usertochat}=req.params
        const myid=req.user._id
        const messages = await Message.find({
            $or: [
                { senderId: myid, receiverId: usertochat },
                { senderId: usertochat, receiverId: myid }
            ]
        })
        .select("senderId receiverId text image createdAt") // Only necessary fields
        .sort({ createdAt: 1 });
        
        
        res.status(200).json({
            success:true,
            messages
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const sendmessage = async (req, res) => {
    try {
        const { text } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imgurl = "";
        if (req.file) {
            try {
                const uploadresult = await cloudinary.uploader.upload(req.file.path, {
                    folder: "DisCuss",
                    resource_type: "auto"
                });
                imgurl = uploadresult.secure_url || "";
            } catch (cloudinaryError) {
                return res.status(500).json({ message: "Image upload failed", error: cloudinaryError.message });
            }
        }

        const message = new Message({
            senderId,
            receiverId,
            text,
            image: imgurl
        });
        await message.save();

        const receiversocketid=getreceiverSocketId(receiverId);
        if(receiversocketid){
            io.to(receiversocketid).emit("newmessage",message)
        }

        // ✅ Return only message data, not user details
        res.status(201).json({
            success: true,
            message
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
