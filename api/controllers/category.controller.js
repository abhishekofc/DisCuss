import category from "../models/category.model.js";

// Add Category
export const addcategory = async (req, res) => {
    try {
        const { name, slug } = req.body;

        // Check if category already exists
        const existingCategory = await category.findOne({ slug });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category with this slug already exists"
            });
        }

        const newCategory = new category({ name, slug });
        await newCategory.save();

        res.status(201).json({
            success: true,
            message: "Category added successfully",
            category: newCategory
        });
    } catch (error) {
        console.error("Error in addcategory function:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Edit Category
export const editcategory = async (req, res) => {
    try {
        const { categoryid } = req.params;
        const { name, slug } = req.body;

        const updatedCategory = await category.findByIdAndUpdate(
            categoryid,
            { name, slug },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json({ success: true, message: "Category updated", category: updatedCategory });
    } catch (error) {
        console.error("Error in editcategory function:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Show Single Category
export const showcategory = async (req, res) => {
    try {
        const { categoryid } = req.params;
        const foundCategory = await category.findById(categoryid);

        if (!foundCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json({ success: true, category: foundCategory });
    } catch (error) {
        console.error("Error in showcategory function:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Category
export const deletecategory = async (req, res) => {
    try {
        const { categoryid } = req.params;
        const deletedCategory = await category.findByIdAndDelete(categoryid);

        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error in deletecategory function:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Categories
export const getallcategory = async (req, res) => {
    try {
        const categories = await category.find().sort({name:1}).lean().exec();

        res.json({ success: true, categories });
    } catch (error) {
        console.error("Error in getallcategory function:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
