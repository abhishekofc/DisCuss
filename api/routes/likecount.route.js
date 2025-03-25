import express from "express";
import { dolike,likecount } from "../controllers/like.controllers.js";
import { authenticate } from "../authenticate.js";

const likeroute = express.Router();

// Correct HTTP methods
likeroute.post('/do-like',authenticate, dolike);
likeroute.get('/get-like/:blogid/:userid?', likecount);

export default likeroute;
