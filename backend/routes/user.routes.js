import express from "express";
import {
  checkAuth,
  loginUser,
  logout,
  registerUser,
  getProfile,
  updateProfile,
} from "../controller/user.controller.js";
import authUser from "../middlewares/authUser.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/is-auth", authUser, checkAuth);
router.get("/logout", authUser, logout);
router.get("/profile", authUser, getProfile);
router.put("/profile", authUser, updateProfile);

export default router;
