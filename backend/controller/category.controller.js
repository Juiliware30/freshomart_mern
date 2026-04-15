import Category from "../models/category.model.js";
import { v2 as cloudinary } from "cloudinary";

// Add category
export const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const imageFile = req.file;

        if (!name || !imageFile) {
            return res.status(400).json({ success: false, message: "Details missing" });
        }

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image",
        });
        const imageUrl = imageUpload.secure_url;

        const categoryData = {
            name,
            image: imageUrl,
        };

        const newCategory = new Category(categoryData);
        await newCategory.save();

        res.json({ success: true, message: "Category added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// List categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json({ success: true, categories });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;
        await Category.findByIdAndDelete(id);
        res.json({ success: true, message: "Category deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
