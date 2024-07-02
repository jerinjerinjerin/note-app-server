import express from 'express';
import { 
    CreateUser, 
    GetUser, 
    LoginUser } from '../controller/user.controller.js'
import { authenticateToken} from'../utillites.js'

const router = express.Router();

router.post('/create-account', CreateUser)
router.post('/login-account', LoginUser)
router.get('/get-user',authenticateToken,GetUser)


export default router;