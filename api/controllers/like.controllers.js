import mongoose from "mongoose";
import Like from "../models/bloglike.model.js";

export const dolike = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { author, blogid } = req.body;

    // Execute the transactional operations directly
    let isuserlike;
    // First, attempt to delete an existing like.
    const deletionResult = await Like.deleteOne({ author, blogid }).session(
      session
    );
    if (deletionResult.deletedCount === 1) {
      // A like existed and was removed.
      isuserlike = false;
    } else {
      // No like existed, so try to add one.
      try {
        await new Like({ author, blogid }).save({ session });
        isuserlike = true;
      } catch (err) {
        // Handle duplicate key error that may occur if two requests try to insert simultaneously.
        if (err.code === 11000) {
          // If duplicate key error, it means a like was inserted by a concurrent request.
          isuserlike = true;
        } else {
          throw err;
        }
      }
    }

    // Count the total likes for the blog inside the transaction.
    const likecount = await Like.countDocuments({ blogid }).session(session);

    // Commit the transaction.
    await session.commitTransaction();
    res.status(200).json({ isuserlike, likecount });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error toggling like:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while toggling like",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

// Get like count for a specific blog.
export const likecount = async (req, res) => {
  const { blogid, userid } = req.params;
  try {
    const likecount = await Like.countDocuments({ blogid });
    let isuserlike = false;
    if (userid) {
      const getuserlike = await Like.countDocuments({ blogid, author: userid });
      if (getuserlike > 0) isuserlike = true;
    }
    res.status(200).json({ likecount, isuserlike });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching like count",
      error: error.message,
    });
  }
};
