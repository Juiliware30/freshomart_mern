import express from "express";
import authUser from "../middlewares/authUser.js";
import { createPaymentIntent } from "../controller/payment.controller.js";

const router = express.Router();

router.post("/create-intent", authUser, createPaymentIntent);

export default router;
