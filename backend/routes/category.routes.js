import express from "express";
import {
    addCategory,
    deleteCategory,
    getCategories,
} from "../controller/category.controller.js";
import { authSeller } from "../middlewares/authSeller.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post("/add", authSeller, upload.single("image"), addCategory);
router.get("/list", getCategories);
router.post("/delete", authSeller, deleteCategory);

export default router;
