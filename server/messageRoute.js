const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const { MessageModel } = require('./database');

router.get('/messages/:chatId', async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const messages = await MessageModel.find({ chatId });
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/chatName/:chatId', async (req, res) => {
    try {
        const chatId = req.params.chatId;

        const botToken = process.env.TELEGRAM_BOT_TOKEN;

        const telegramApiResponse = await fetch(`https://api.telegram.org/bot${botToken}/getChat?chat_id=${chatId}`);
        const telegramApiData = await telegramApiResponse.json();

        if (telegramApiData.ok) {
            const chatName = telegramApiData.result.title;
            res.send(chatName);
        } else {
            console.error('Telegram API Error:', telegramApiData);
            res.status(404).json({ error: 'Group chat not found' });
        }
    } catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
