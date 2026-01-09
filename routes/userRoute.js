import express from "express";
import { getOtherUsers, getProfile, login, logout } from "../controllers/userController.js";
import { register } from "../controllers/userController.js";
import { isAuthenticated } from "../Middlewares/authMiddleware.js";
const router=express.Router();


router.post('/registration',register)
router.post('/login',login);
router.post('/logout',isAuthenticated,logout)
router.get('/get-profile',isAuthenticated,getProfile)
router.get('/get-other-user',isAuthenticated,getOtherUsers)

export default router;