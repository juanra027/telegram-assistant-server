import express from 'express';
import telegramCtrl from '../controllers/telegram.controller';

const router = express.Router();

//Routes
router.get('/auth', telegramCtrl.auth);
router.post('/', telegramCtrl.helloWorld);
router.post('/sendMessage', telegramCtrl.sendMesage);
router.post('/sendPhoto', telegramCtrl.sendPhoto);
router.post('/sendPhoto2', telegramCtrl.sendPhoto2);
router.post('/sendPhoto3', telegramCtrl.sendPhoto3);


export default router