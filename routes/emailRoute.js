import express from "express";
import { sendotp, verifyOTP } from "../controllers/emailController.js";
const router=express.Router();




router.post('/send',sendotp)
router.post('/verify', verifyOTP)


export default router;