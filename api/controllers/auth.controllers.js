import User from "../models/user.model.js";  
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });  
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });  // Rename "user" to "newUser"

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error in register function:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token=jwt.sign({
            _id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            role:user.role
            
        },process.env.JWT_SECRET)

        res.cookie("access_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production"?"none":"strict",
            path:"/"
        })
        const newuser=user.toObject({getters:true})
        delete newuser.password

        res.status(200).json({ message: "Login successful",token, user: newuser,success:true });


    } catch (error) {
        console.error("Error in login function:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const Googlelogin = async (req, res) => {
    try {
        const {name, email, avatar } = req.body;
        let user
         user = await User.findOne({ email });
        if (!user) {
            // create
            const password=Math.random().toString()
            const hashpass=bcrypt.hashSync(password,10)
            const newuser=new User({
                name,email,password:hashpass,avatar
            })
            user= await newuser.save();
        }

        const token=jwt.sign({
            _id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            role:user.role
            
        },process.env.JWT_SECRET)

        res.cookie("access_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production"?"none":"strict",
            path:"/"
        })
        const newuser=user.toObject({getters:true})
        delete newuser.password

        res.status(200).json({ message: "Login successful",token, user: newuser,success:true });


    } catch (error) {
        console.error("Error in login function:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const logout = async (req, res) => {
    try {
        res.clearCookie("access_token",{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production"?"none":"strict",
            path:"/"
        })

        res.status(200).json({ message: "Logout successful", user: null,success:true });


    } catch (error) {
        console.error("Error in login function:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
