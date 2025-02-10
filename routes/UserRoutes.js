import express from 'express';
const router = express.Router();

import UserController from '../controllers/userController.js'

router.post('/register', UserController.userRegistration)
router.post('/verify-email',UserController.verifiyEmail)
router.post('/resendOtp',UserController.resendOtp)
router.post('/login',UserController.userLogin)

export default router