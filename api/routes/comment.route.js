import express from "express";
import { addcomment, countcomment, deletecomment, getallcomment, getcomment } from "../controllers/comment.controllers.js";
import { authenticate } from "../authenticate.js";

const commentroute = express.Router();

// Correct HTTP methods
commentroute.post('/add',authenticate ,addcomment);
commentroute.get('/get/:blogid' ,getcomment);
commentroute.delete('/delete/:commentid',authenticate,deletecomment);
commentroute.get('/count/:blogid', countcomment);
commentroute.get('/get-all-comment', getallcomment);

export default commentroute;
