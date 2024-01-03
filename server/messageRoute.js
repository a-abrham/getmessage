const express = require('express');
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

module.exports = router;
