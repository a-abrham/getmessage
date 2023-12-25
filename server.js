const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

const TELEGRAM_BOT_TOKEN = '6800171225:AAFxBA3gsM9ZpjX2h6YsKBdNJwMGSLoN98s';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
const app = express();

app.use(bodyParser.json());

function logMessageInfo(message, prefix = '') {
  const messageId = message.message_id;
  const chatId = message.chat.id;
  const senderUsername = message.from.username || 'N/A';

  console.log(`${prefix}Received message (${messageId}) from user ${chatId} (${senderUsername}):`);
}

app.post('/webhook', (req, res) => {
  const { message } = req.body;

  if (message) {
    logMessageInfo(message);
  
    if (msg.photo) {
        const photoIds = msg.photo.map(photo => photo.file_id);
      
        console.log(`  Photo(s) received: ${photoIds.join(', ')}`);
      
        photoIds.forEach(photoId => {
          bot.getFile(photoId).then((fileInfo) => {
            const photoUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileInfo.file_path}`;
            console.log(`  Photo URL: ${photoUrl}`);
          }).catch((error) => {
            console.error('Error getting file information for photo:', error);
          });
        });
      }
    else if (message.document) {
      console.log(`  Document received: ${message.document.file_id}`);
    } else if (message.audio) {
      console.log(`  Audio received: ${message.audio.file_id}`);
    } else if (message.video) {
      console.log(`  Video received: ${message.video.file_id}`);
    } else if (message.voice) {
      console.log(`  Voice message received: ${message.voice.file_id}`);
    } else {
      const text = message.text || '';
      console.log(`  Text: "${text}"`);
    }
  }
  
  res.status(200).end();
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

bot.on('message', (msg) => {
    logMessageInfo(msg);
  
    if (msg.photo) {
      console.log(`  Photo(s) received: ${msg.photo.map(photo => photo.file_id).join(', ')}`);
    } else if (msg.document) {
      console.log(`  Document received: ${msg.document.file_id}`);
      getFileInformation(msg.document.file_id, 'Document');
    } else if (msg.audio) {
      console.log(`  Audio received: ${msg.audio.file_id}`);
      getFileInformation(msg.audio.file_id, 'Audio');
    } else if (msg.video) {
      console.log(`  Video received: ${msg.video.file_id}`);
      getFileInformation(msg.video.file_id, 'Video');
    } else if (msg.voice) {
      console.log(`  Voice message received: ${msg.voice.file_id}`);
      getFileInformation(msg.voice.file_id, 'Voice Message');
    } else {
      const text = msg.text || '';
      console.log(`  Text: "${text}"`);
    }
  });
  
  function getFileInformation(fileId, fileType) {
    bot.getFile(fileId).then((fileInfo) => {
      const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileInfo.file_path}`;
      console.log(`  ${fileType} URL: ${fileUrl}`);
    }).catch((error) => {
      console.error(`Error getting ${fileType.toLowerCase()} information:`, error);
    });
  }