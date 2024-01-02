const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL);

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

module.exports = {
  MessageModel,
};
