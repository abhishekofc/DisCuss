import Blog from "./../models/blog.model.js"
import cloudinary from "../config/cloudinary.js"
import mongoose from "mongoose";
import Category from "./../models/category.model.js"
import User from "./../models/user.model.js"

export const addblog = async (req, res) => {
    try {
        const data = JSON.parse(req.body.data);

        let featuredimg = "";
        if (req.file) {
            try {
                const uploadresult = await cloudinary.uploader.upload(req.file.path, {
                    folder: "DisCuss",
                    resource_type: "auto"
                });
                featuredimg = uploadresult.secure_url || "";
            } catch (cloudinaryError) {
                return res.status(500).json({ message: "Image upload failed", error: cloudinaryError.message });
            }
        }

        const existingslug = await Blog.findOne({ slug: data.slug });
        if (existingslug) {
            return res.status(400).json({
                success: false,
                message: "Blog with this Title already exists"
            });
        }

        const newBlog = new Blog({
            author: new mongoose.Types.ObjectId(data.author), // Ensure author is ObjectId
            category: new mongoose.Types.ObjectId(data.category), // Convert category to ObjectId
            title: data.title,
            slug: data.slug,
            featuredimage: featuredimg,
            blogContent: data.blogContent
        });
        

        const savedBlog = await newBlog.save();
        // console.log("Saved Blog:", savedBlog);

        res.status(200).json({ success: true, newBlog, message: "Blog Created Successfully" });
    } catch (error) {
        console.error("Error in addblog:", error);
        return res.status(500).json({ message: "Error in Adding blog" });
    }
};


export const editblog = async (req, res) => {
    try {
        const { blogid } = req.params;
        // console.log(blogid);
        if (!mongoose.Types.ObjectId.isValid(blogid)) {
            return res.status(400).json({ message: "Invalid blog ID format" });
        }
        
        const editblog = await Blog.findById(blogid);
        // console.log(editblog);

        if (!editblog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json({ editblog, success: true, message: "Blog fetched successfully" });
    } catch (error) {
        console.error("Error in editblog:", error);
        return res.status(500).json({ message: "Some error occurred in editing blog", error: error.message });
    }
};

export const updateblog=async (req,res)=>{
    try {
        const data = JSON.parse(req.body.data);
        const {blogid}=req.params
        const blog=await Blog.findById(blogid)

        blog.category=data.category
        blog.title=data.title
        blog.slug=data.slug
        blog.blogContent=data.blogContent

        let featuredimg = blog.featuredimage;
        if (req.file) {
            try {
                const uploadresult = await cloudinary.uploader.upload(req.file.path, {
                    folder: "DisCuss",
                    resource_type: "auto"
                });
                featuredimg = uploadresult.secure_url || "";
            } catch (cloudinaryError) {
                return res.status(500).json({ message: "Image upload failed", error: cloudinaryError.message });
            }
        }
        blog.featuredimage=featuredimg
        await blog.save()

        // console.log("Saved Blog:", savedBlog);

        res.status(200).json({ success: true, blog, message: "Blog updated Successfully" });
    } catch (error) {
        console.error("Error in addblog:", error);
        return res.status(500).json({ message: "Error in Adding blog" });
    }
}
export const deleteblog = async (req, res) => {
    try {
        const { blogid } = req.params;
        
        // Check if the blog exists before deletion
        const blog = await Blog.findById(blogid);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // Delete the blog
        await Blog.findByIdAndDelete(blogid);

        return res.json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json({ success: false, message: "Some error occurred in deleting blog", error: error.message });
    }
};

export const getblogbycategory = async (req, res) => {
  try {
    const { slug } = req.params;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    // Find category by slug (case-insensitive)
    const categorydata = await Category.findOne({ slug: new RegExp(`^${slug}$`, "i") });

    if (!categorydata) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const categoryid = categorydata._id;

    // Fetch filtered blogs
    const blogs = await Blog.find({ category: categoryid })
      .populate("author", "name avatar")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Correctly count total blogs for the given category
    const totalBlogs = await Blog.countDocuments({ category: categoryid });

    // Calculate total pages
    const totalPages = Math.ceil(totalBlogs / limit);

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        totalBlogs,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error("Error in getblogbycategory:", error);
    res.status(500).json({ success: false, message: "Failed to get blog" });
  }
};



export const showallblog = async (req, res) => {
  try {
    let total=Blog.countDocuments()
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || total ;

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;
    const [blogs, totalBlogs] = await Promise.all([
      Blog.find()
        .populate("author", "name email avatar")
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments()
    ]);

    const totalPages = Math.ceil(totalBlogs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        totalBlogs,
        totalPages,
        currentPage: page,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error in showallblog:", error);
    res.status(500).json({ success: false, message: "Error fetching blogs", error: error.message });
  }
};




  export const getblog = async (req, res) => {
    try {
        const { slug } = req.params;
        
        if (!slug) {
            return res.status(400).json({ success: false, message: "Slug is required" });
        }

        const blog = await Blog.findOne({ slug })
            .populate("author", "name avatar role bio") 
            .populate("category", "name slug")
            .lean()
            .exec();

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        res.status(200).json({ success: true, blog });
    } catch (error) {
        console.error("Error in getblog:", error);
        res.status(500).json({ success: false, message: "Failed to get blog" });
    }
};


export const getrelatedblog = async (req, res) => {
    try {
      // Use 'slug' instead of 'category'
      const { slug } = req.params;
      const categorydata = await Category.findOne({ slug });
      
      if (!categorydata) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
      
      const categoryid = categorydata._id;
      const blog = await Blog.find({ category: categoryid }).populate("author","name avatar").populate("category","name slug").lean().exec();
      
      res.status(200).json({ success: true, blog });
    } catch (error) {
      console.error("Error in getrelatedblog:", error);
      res.status(500).json({ success: false, message: "Failed to get blog" });
    }
  };
  

  
  export const search = async (req, res) => {
    try {
      const { q } = req.query;
  
      // Find categories where the name matches the query (case-insensitive)
      const matchingCategories = await Category.find({
        name: { $regex: q, $options: "i" },
      }).select("_id").lean();
  
      // Find authors where the name matches the query (case-insensitive)
      const matchingAuthors = await User.find({
        name: { $regex: q, $options: "i" },
      }).select("_id").lean();
  
      // Extract the _id arrays
      const categoryIds = matchingCategories.map((cat) => cat._id);
      const authorIds = matchingAuthors.map((author) => author._id);
  
      // Search for blogs where:
      // - title matches the query, OR
      // - category is in the matching category IDs, OR
      // - author is in the matching author IDs.
      const blog = await Blog.find({
        $or: [
          { title: { $regex: q, $options: "i" } },
          { category: { $in: categoryIds } },
          { author: { $in: authorIds } },
        ],
      })
        .populate("author", "name avatar")
        .populate("category", "name slug")
        .lean()
        .exec();
  
      res.status(200).json({ success: true, blog });
    } catch (error) {
      console.error("Error in search:", error);
      res.status(500).json({ success: false, message: "Failed to get blog" });
    }
  };
  
  
