import express from 'express';
import telegramCtrl from '../controllers/telegram.controller';

const router = express.Router();

//Routes
router.get('/auth', telegramCtrl.auth);
router.post('/sendMessage', telegramCtrl.sendMesage);


export default router