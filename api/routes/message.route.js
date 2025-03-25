import express from "express";
import { authenticate } from "../authenticate.js";
import upload from "../config/multer.js";
import { getuserforsidebar,getmessages,sendmessage } from "../controllers/message.controllers.js";
const router=express.Router()

router.get("/users",authenticate,getuserforsidebar)
router.get("/:id",authenticate,getmessages)

router.post("/send/:id",authenticate,upload.single('file'),sendmessage)
export default router;