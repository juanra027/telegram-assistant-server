import express from 'express';
import telegramCtrl from '../controllers/telegram.controller';

const router = express.Router();

//Routes
router.get('/auth', telegramCtrl.auth);
router.post('/', telegramCtrl.helloWorld);
router.post('/sendMessage', telegramCtrl.sendMesage);
router.post('/sendPhoto', telegramCtrl.sendPhoto);


export default router