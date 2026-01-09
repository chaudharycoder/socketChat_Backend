import express from "express";
import { isAuthenticated } from "../Middlewares/authMiddleware.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";
const router=express.Router();




router.post('/send/:receiverId',isAuthenticated,sendMessage)
router.get('/get-message/:otherParticipantId',isAuthenticated,getMessages)


export default router;