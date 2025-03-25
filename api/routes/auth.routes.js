import express from "express"
import { Googlelogin, login,logout,register } from "../controllers/auth.controllers.js"
import { authenticate } from "../authenticate.js"

const authrouter=express.Router()

authrouter.post('/register',register)
authrouter.post('/login',login)
authrouter.post('/googlelogin',Googlelogin)
authrouter.post('/logout',authenticate,logout)


export default authrouter