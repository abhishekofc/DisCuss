import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"

export const getuser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user,
            success: true,
            message: "User data found"
        });
    } catch (error) {
        console.error("Error in Getting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const deleteuser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId).lean();

        res.status(200).json({
            success:true,
            message: "User Deleted Successfully"
        });
    } catch (error) {
        console.error("Error in Getting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getalluser = async (req, res) => {
    try {
        const user = await User.find().sort({createdAt:-1});

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user,
            success: true,
            message: "User data found"
        });
    } catch (error) {
        console.error("Error in Getting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const updateuser = async (req, res) => {
    try {
        const data=JSON.parse(req.body.data)
        const {userId}=req.params


        let user = await User.findById(userId);
        user.name=data.name
        user.email=data.email
        user.bio=data.bio

        if(data.password && data.password.length>=8){
            const hashedpass=bcrypt.hashSync(data.password)
            user.password=hashedpass
        }

        const newuser=user.toObject({getters:true})
        delete newuser.password
        
        
        if (req.file) {
            const uploadresult = await cloudinary.uploader.upload(req.file.path, {
                folder: "DisCuss", resource_type:"auto"
            })
            user.avatar=uploadresult.secure_url
        }

        // Extract form data
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user:newuser
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
