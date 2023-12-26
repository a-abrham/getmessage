const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const mongoose = require('mongoose');


const TELEGRAM_BOT_TOKEN = '6800171225:AAFxBA3gsM9ZpjX2h6YsKBdNJwMGSLoN98s';
const MONGODB_URI = 'mongodb+srv://abrshkorra:wZKjYPwJFvuDhtvF@telegramgcmsg.osalm2g.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const MessageSchema = new mongoose.Schema({
  messageId: Number,
  chatId: Number,
  senderUsername: String,
  text: String,
  photoUrls: [String],
  documentUrl: String,
  audioUrl: String,
  videoUrl: String,
  voiceUrl: String,
});

const MessageModel = mongoose.model('Message', MessageSchema);

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
const app = express();

function logMessageInfo(message, prefix = '') {
  const messageId = message.message_id;
  const chatId = message.chat.id;
  const senderUsername = message.from.username || 'N/A';

  console.log(`${prefix}Received message (${messageId}) from user ${chatId} (${senderUsername}):`);

  const savedMessage = new MessageModel({
    messageId: messageId,
    chatId: chatId,
    senderUsername: senderUsername,
    text: message.text || '',
    photoUrls: [],
    documentUrl: '',
    audioUrl: '',
    videoUrl: '',
    voiceUrl: '',
  });

  const fetchMediaUrlsPromises = [];

  if (message.photo) {
    const photoIds = message.photo.map(photo => photo.file_id);
    console.log(`  Photo(s) received: ${photoIds.join(', ')}`);

    photoIds.forEach(photoId => {
      fetchMediaUrlsPromises.push(getFileInformation(photoId, 'Photo', savedMessage.photoUrls));
    });
  } else if (message.document) {
    console.log(`  Document received: ${message.document.file_id}`);
    fetchMediaUrlsPromises.push(getFileInformation(message.document.file_id, 'Document', savedMessage.documentUrl));
  } else if (message.audio) {
    console.log(`  Audio received: ${message.audio.file_id}`);
    fetchMediaUrlsPromises.push(getFileInformation(message.audio.file_id, 'Audio', savedMessage.audioUrl));
  } else if (message.video) {
    console.log(`  Video received: ${message.video.file_id}`);
    fetchMediaUrlsPromises.push(getFileInformation(message.video.file_id, 'Video', savedMessage.videoUrl));
  } else if (message.voice) {
    console.log(`  Voice message received: ${message.voice.file_id}`);
    fetchMediaUrlsPromises.push(getFileInformation(message.voice.file_id, 'Voice Message', savedMessage.voiceUrl));
  }

  Promise.all(fetchMediaUrlsPromises)
    .then(() => {
      return savedMessage.save();
    })
    .then(() => {
      console.log('Message saved to MongoDB');
    })
    .catch(error => console.error('Error saving message to MongoDB:', error));
}

app.post('/webhook', (req, res) => {
  const { message } = req.body;

  if (message) {
    logMessageInfo(message);

    if (message.photo) {
      const photoIds = message.photo.map(photo => photo.file_id);

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

app.listen(3005, () => {
  console.log('Server is listening on port 3005');
});

bot.on('message', (msg) => {
    logMessageInfo(msg);
  
    if (msg.photo) {
      console.log(`  Photo(s) received: ${msg.photo.map(photo => photo.file_id).join(', ')}`);
    } else if (msg.document) {
      console.log(`  Document received: ${msg.document.file_id}`);
    } else if (msg.audio) {
      console.log(`  Audio received: ${msg.audio.file_id}`);
    } else if (msg.video) {
      console.log(`  Video received: ${msg.video.file_id}`);
    } else if (msg.voice) {
      console.log(`  Voice message received: ${msg.voice.file_id}`);
    } else {
      const text = msg.text || '';
      console.log(`  Text: "${text}"`);
    }
  });
  
  function getFileInformation(fileId, fileType, mediaUrlField) {
    if (!Array.isArray(mediaUrlField)) {
      mediaUrlField = [];
    }
  
    return bot.getFile(fileId)
      .then((fileInfo) => {
        const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileInfo.file_path}`;
        console.log(`  ${fileType} URL: ${fileUrl}`);
  
        mediaUrlField.push(fileUrl);
        return mediaUrlField;
      })
      .catch((error) => {
        console.error(`Error getting ${fileType.toLowerCase()} information:`, error);
      });
  }