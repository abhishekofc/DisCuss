import express from "express";
import {addblog,showallblog,updateblog,editblog,deleteblog, getblog, getrelatedblog, getblogbycategory, search } from "../controllers/blog.controller.js";
import upload from "../config/multer.js";
import { authenticate } from "../authenticate.js";

const blogroutes = express.Router();

// Correct HTTP methods
blogroutes.post('/add',authenticate,upload.single('file'), addblog);
blogroutes.put('/update/:blogid',authenticate,upload.single('file'), updateblog);
blogroutes.get('/edit/:blogid', authenticate,editblog);
blogroutes.delete('/delete/:blogid',authenticate ,deleteblog);
blogroutes.get('/get-all',showallblog);

blogroutes.get('/get-blog/:slug', getblog);
blogroutes.get('/get-related-blog/:slug', getrelatedblog);
blogroutes.get('/get-blog-by-category/:slug', getblogbycategory);
blogroutes.get('/search', search);

export default blogroutes;
