import Product from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";

// add product :/api/product/add
export const addProduct = async (req, res) => {
  try {
    const { name, price, offerPrice, description, category, gstEnabled, gstPercentage, gstType } = req.body;
    // upload images to cloudinary from buffer
    const imagePromises = req.files?.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString("base64");
      let dataURI = "data:" + file.mimetype + ";base64," + b64;
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        resource_type: "image",
      });
      return uploadResponse.secure_url;
    });

    const image = await Promise.all(imagePromises || []);
    if (
      !name ||
      !price ||
      !offerPrice ||
      !description ||
      !category ||
      !image ||
      image.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields including images are required",
      });
    }

    const product = new Product({
      name,
      price,
      offerPrice,
      description,
      category,
      image,
      gstEnabled: gstEnabled === "true" || gstEnabled === true,
      gstPercentage: Number(gstPercentage) || 0,
      gstType: gstType || "percentage",
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      product: savedProduct,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error in addProduct:", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error while adding product" });
  }
};

// get products :/api/product/get
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// get single product :/api/product/id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// change stock  :/api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, product, message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// remove product  :/api/product/remove
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// update product  :/api/product/update
export const updateProduct = async (req, res) => {
  try {
    const { id, name, price, offerPrice, description, category, inStock, existingImages, imagePositions, gstEnabled, gstPercentage, gstType } = req.body;

    // FormData sends everything as strings
    const updateData = {
      name,
      price,
      offerPrice,
      description,
      category,
      inStock: inStock === "true",
      gstEnabled: gstEnabled === "true",
      gstPercentage: Number(gstPercentage) || 0,
      gstType: gstType || "percentage"
    };

    let images = existingImages ? JSON.parse(existingImages) : [];

    if (req.files && req.files.length > 0) {
      // Ensure positions is an array of numbers
      let positions = imagePositions;
      if (!Array.isArray(positions)) {
        positions = [positions];
      }
      positions = positions.map(Number);

      const uploadPromises = req.files.map(async (file, i) => {
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          resource_type: "image",
        });
        const targetIndex = positions[i];
        images[targetIndex] = uploadResponse.secure_url;
      });

      await Promise.all(uploadPromises);
    }

    updateData.image = images.filter(img => img !== null);

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ success: true, product, message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
