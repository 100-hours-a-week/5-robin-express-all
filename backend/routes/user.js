import express from "express";
import userController from '../controllers/userController.js';
const router = express.Router();


router.post('/login', userController.validAccount);
router.post('/signup', userController.signAccount);
router.post('/upload/profile-image', userController.uploadProfile);
export default router;