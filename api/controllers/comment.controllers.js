import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
// import Blog from "../models/blog.model.js";


export const addcomment = async (req, res) => {
    try {
        const { author, blogid, Comment: commentText } = req.body; // Rename 'Comment' to 'commentText'

        const newcomment = new Comment({
            author: author, // Ensure author is ObjectId
            blogid: blogid,
            comment: commentText, // Use the renamed variable
        });

        await newcomment.save();

        res.status(200).json({ success: true, newcomment, message: "Comment submitted" });
    } catch (error) {
        console.error("Error in comment:", error);
        return res.status(500).json({ message: "Error in adding comment" });
    }
};
export const getcomment = async (req, res) => {
    try {
        const {blogid}=req.params
        

        const comment= await Comment.find({blogid}).populate("author","name avatar").sort({createdAt:-1}).lean().exec();

        res.status(200).json({ success: true, comment, message: "Comment submitted" });
    } catch (error) {
        console.error("Error in comment:", error);
        return res.status(500).json({ message: "Error in adding comment" });
    }
};

export const deletecomment = async (req, res) => {
    try {
        const { commentid } = req.params;
        
        // Check if the blog exists before deletion
        const comment = await Comment.findById(commentid);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Delete the blog
        await Comment.findByIdAndDelete(commentid);

        return res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ success: false, message: "Some error occurred in deleting comment", error: error.message });
    }
};
export const countcomment = async (req, res) => {
    try {
      const { blogid } = req.params;
      
      // Count comments with a filter object matching the blogid
      const cnt = await Comment.countDocuments({ blogid });
      
      return res.json({ success: true, cnt, message: "Comment count fetched successfully" });
    } catch (error) {
      console.error("Error fetching comment count:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Some error occurred while fetching comment count", 
        error: error.message 
      });
    }
  };
  
export const getallcomment = async (req, res) => {
    try {
      
      // Count comments with a filter object matching the blogid
      const comments = await Comment.find().populate("blogid","title").populate("author","name email").sort({createdAt:-1}).lean().exec();
      
      return res.status(200).json({ success: true, comments, message: "Comment count fetched successfully" });
    } catch (error) {
      console.error("Error fetching comment count:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Some error occurred while fetching comment count", 
        error: error.message 
      });
    }
  };
  