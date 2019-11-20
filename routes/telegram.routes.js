import express from 'express';
import telegramCtrl from '../controllers/telegram.controller';

const router = express.Router();

//Routes
router.get('/start', telegramCtrl.startBot);
router.get('/stop', telegramCtrl.stopBot);

router.post('/login', telegramCtrl.auth);
router.post('/sendMessage', telegramCtrl.sendMesage);
router.post('/sendPhoto', telegramCtrl.sendPhoto);
router.post('/sendPhoto2', telegramCtrl.sendPhoto2);
router.post('/sendPhoto3', telegramCtrl.sendPhoto3);


export default router